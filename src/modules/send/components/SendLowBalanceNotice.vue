<template>
  <div>
    <app-modal
      :show="openQR"
      :close="closeQR"
      :has-buttons="false"
      width="400px"
    >
      <template #dialogBody>
        <app-addr-qr />
      </template>
    </app-modal>
    <v-row class="pa-2 backgroundGrey border-radius--5px">
      <v-col cols="12">
        <v-row align-content="center" justify="space-around">
          <v-col cols="12" class="pb-0">
            <p class="font-weight-bold ma-0">
              <v-icon class="black--text mew-body">
                mdi-information-outline
              </v-icon>
              Your {{ currencyName }} balance is too low
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="mew-body textMedium--text">
              Every transaction requires a small amount of
              {{ currencyName }} to execute. Even if you have tokens to swap,
              when your {{ currencyName }} balance is close to zero, you won't
              be able to send anything until you fund your account.
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex flex-column">
            <div
              class="mew-body greenPrimary--text font-weight-medium cursor--pointer"
              @click="openBarcodeModal"
            >
              Transfer {{ currencyName }} from another account
            </div>
            <br />
            <a
              v-if="isEthNetwork"
              class="mew-body font-weight-medium"
              rel="noopener noreferrer"
              @click="openMoonpay"
            >
              Buy {{ currencyName }}
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import buyMore from '@/core/mixins/buyMore.mixin.js';

export default {
  components: {
    AppModal: () => import('@/core/components/AppModal'),
    AppAddrQr: () => import('@/core/components/AppAddrQr')
  },
  mixins: [buyMore],
  props: {
    currencyName: {
      type: String,
      default: 'ETH'
    }
  },
  data() {
    return {
      openQR: false
    };
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork'])
  },
  methods: {
    openBarcodeModal() {
      this.openQR = true;
    },
    closeQR() {
      this.openQR = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-caption {
  color: var(--v-textLight);
}

.address-overflow {
  word-break: break-all;
}

.info-container {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
