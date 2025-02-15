<!--
=====================================================================================
 Access Wallet - Keepkey
=====================================================================================
-->
<template>
  <div>
    <!--
=====================================================================================
Custom Paths
=====================================================================================
-->
    <div class="text-right">
      <access-wallet-derivation-path
        :selected-path="selectedPath"
        :passed-paths="paths"
        @setPath="setPath"
      />
    </div>
    <div>
      <!--
=====================================================================================
Pin Pad
=====================================================================================
-->
      <div class="d-flex flex-column">
        <span class="mew-heading-2 mb-2"> Enter your PIN. </span>
        <span class="mew-heading-4 mb-5">
          The PIN layout is displayed on your Hardware wallet.
        </span>
      </div>
      <mew-input
        v-model="pin"
        hide-password-icon
        type="password"
        class="mb-5"
      />
      <v-container
        class="mb-8 pa-0 d-flex flex-column align-center justify-center"
      >
        <v-row class="keypad" no-gutters>
          <v-col v-for="(number, idx) in numbers" :key="idx" cols="4">
            <div
              :class="[
                'rounded pin mr-2 mb-2 d-flex cursor-pointer align-center justify-center',
                pinEnabled ? 'greyLight' : 'greyLight'
              ]"
              @click="pin += number"
            >
              <div
                :class="[
                  'pin-inner-circle',
                  pinEnabled ? 'greenPrimary' : 'disabledPrimary'
                ]"
              ></div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <!--
=====================================================================================
Unlock wallet button
=====================================================================================
-->
      <mew-button
        title="Unlock wallet"
        btn-size="xlarge"
        has-full-width
        :loading="loading && !handlerLoaded"
        :disabled="loading && !handlerLoaded"
        @click.native="unlock"
      />
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/core/plugins/eventBus';

export default {
  name: 'AccessWalletKeepkey',
  components: {
    AccessWalletDerivationPath: () => import('./AccessWalletDerivationPath.vue')
  },
  props: {
    paths: {
      type: Array,
      default: () => []
    },
    handlerLoaded: {
      type: Boolean,
      default: false
    },
    selectedPath: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      callback: () => [],
      pinEnabled: false,
      pin: '',
      loading: false,
      numbers: ['7', '8', '9', '4', '5', '6', '1', '2', '3']
    };
  },
  watch: {
    pin(newValue) {
      if (newValue === null) {
        this.pin = '';
      }
    }
  },
  created() {
    /**
     * Listens to event: enablePin to allow user to input pin
     * also saves callback method to use later on
     */
    EventBus.$on('enablePin', (deviceInfo, callback) => {
      this.callback = callback;
      // this.deviceInfo = deviceInfo;
      this.pinEnabled = true;
    });
  },
  methods: {
    /**
     * emits setPath back to parent in order to unlock wallet correctly
     */
    setPath(path) {
      this.pin = '';
      this.$emit('setPath', path);
    },
    /**
     * uses callback method from handler to unlock wallet
     */
    unlock() {
      this.loading = true;
      this.callback(this.pin);
    }
  }
};
</script>

<style lang="scss" scoped>
.keypad {
  width: 266px;
  .pin {
    height: 80px;
    width: 80px;
    .pin-inner-circle {
      border-radius: 50%;
      height: 20px;
      width: 20px;
    }
  }
}
</style>
