import url from 'url';
import web3 from 'web3';
import MEWProvider from '@/utils/web3-provider';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { formatters } from 'web3-core-helpers';
import EventNames from '@/utils/web3-provider/events';
import { EventBus } from '@/core/plugins/eventBus';
const removeWallet = function ({ commit, state }) {
  if (
    state.identifier === WALLET_TYPES.WALLET_CONNECT ||
    state.identifier === WALLET_TYPES.WALLET_LINK ||
    state.identifier === WALLET_TYPES.MEW_CONNECT
  ) {
    const connection = state.instance.getConnection();
    if (connection && connection.disconnect) {
      connection.disconnect();
    }
  }
  commit('REMOVE_WALLET');
};

const setWallet = function ({ commit, dispatch, state }, params) {
  commit('SET_WALLET', params[0]);
  if (!state.isOfflineApp) {
    dispatch('setWeb3Instance', params[1]);
  }
};
const setTokens = function ({ commit }, params) {
  commit('SET_TOKENS', params);
};

const setAccountBalance = function ({ commit }, balance) {
  commit('SET_BALANCE', balance);
};

const setLedgerBluetooth = function ({ commit }, ledgerBLE) {
  commit('SET_LEDGER_BLUETOOTH', ledgerBLE);
};

const setWeb3Instance = function (
  { commit, state, rootState, rootGetters },
  provider
) {
  const hostUrl = rootState.global.currentNetwork.url
    ? url.parse(rootState.global.currentNetwork.url)
    : rootGetters['global/Networks']['ETH'][0];
  const options = {};
  // eslint-disable-next-line
  const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
    rootState.global.currentNetwork.port
      ? ':' + rootState.global.currentNetwork.port
      : ''
  }${hostUrl.pathname}`;
  rootState.global.currentNetwork.username !== '' &&
  rootState.global.currentNetwork.password !== ''
    ? (options['headers'] = {
        authorization: `Basic: ${btoa(
          rootState.global.currentNetwork.username +
            ':' +
            rootState.global.currentNetwork.password
        )}`
      })
    : {};
  const web3Instance = new web3(
    new MEWProvider(provider ? provider : parsedUrl, options)
  );
  web3Instance.eth.transactionConfirmationBlocks = 1;
  web3Instance['mew'] = {};
  web3Instance['mew'].sendBatchTransactions = arr => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const nonce = await (arr[0].nonce === undefined
        ? web3Instance.eth.getTransactionCount(state.address)
        : arr[0].nonce);
      for (let i = 0; i < arr.length; i++) {
        const gasPrice = rootGetters['global/gasPrice'];

        const localTx = {
          to: arr[i].to,
          data: arr[i].data,
          from: arr[i].from,
          value: arr[i].value
        };
        const gas = await (arr[i].gas === undefined
          ? web3Instance.eth.estimateGas(localTx)
          : arr[i].gas);
        arr[i].nonce = web3.utils.toBN(nonce).addn(i).toString();
        arr[i].gas = gas;
        arr[i].gasLimit = gas;
        arr[i].chainId = !arr[i].chainId
          ? rootGetters['global/network'].type.chainID
          : arr[i].chainId;
        arr[i].gasPrice =
          arr[i].gasPrice === undefined ? gasPrice : arr[i].gasPrice;
        arr[i] = formatters.inputCallFormatter(arr[i]);
      }

      const batchSignCallback = promises => {
        if (promises && promises.rejected)
          reject(new Error('User rejected transaction'));
        resolve(promises);
      };
      EventBus.$emit(
        EventNames.SHOW_BATCH_TX_MODAL,
        arr,
        batchSignCallback,
        state.isHardware
      );
    });
  };
  commit('SET_WEB3_INSTANCE', web3Instance);
};

const setOwnedDomains = function ({ commit }, ownedDomains) {
  commit('SET_OWNED_DOMAINS', ownedDomains);
};

const setBlockNumber = function ({ commit }, val) {
  commit('SET_BLOCK_NUMBER', val);
};

const setOfflineApp = function ({ commit }, val) {
  commit('SET_OFFLINE_APP', val);
};

export default {
  removeWallet,
  setWallet,
  setLedgerBluetooth,
  setAccountBalance,
  setWeb3Instance,
  setBlockNumber,
  setOwnedDomains,
  setTokens,
  setOfflineApp
};
