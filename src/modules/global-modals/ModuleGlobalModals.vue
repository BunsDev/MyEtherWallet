<template>
  <div>
    <app-modal
      :show="showModal"
      :title="title"
      :btn-action="submit"
      :close="reset"
      :btn-enabled="enableButton"
      @close="reset"
    >
      <template #dialogBody>
        <hardware-password-modal
          v-if="openHardwarePassword"
          @password="setPassword"
          @setTerms="setTerms"
        />
      </template>
    </app-modal>
    <app-error-msg
      :show="openError"
      :close="reset"
      :resolve="send"
      :error="errors"
    />
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { EventBus } from '@/core/plugins/eventBus';

const OPEN_HARDWARE_PASSWORD = 'showHardwarePassword';
const ISSUE_MODAL = 'issueModal';
export default {
  components: {
    AppModal: () => import('@/core/components/AppModal.vue'),
    HardwarePasswordModal: () =>
      import('./components/HardwarePasswordModal.vue'),
    AppErrorMsg: () => import('@/core/components/AppErrorMsg.vue')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      deviceInfo: {},
      callback: () => {},
      openHardwarePassword: false,
      openError: false,
      password: '',
      acceptTerms: false,
      errors: {}
    };
  },
  computed: {
    showModal() {
      return this.openHardwarePassword;
    },
    title() {
      const walletName = isEmpty(this.deviceInfo)
        ? 'wallet'
        : this.deviceInfo.name;
      return `Access your ${walletName}`;
    },
    enableButton() {
      if (this.openHardwarePassword) {
        return this.acceptTerms && this.password !== '';
      }
      return this.password !== '';
    }
  },
  created() {
    EventBus.$on(ISSUE_MODAL, (errors, callback) => {
      this.trackNetworkSwitch(errors);
      this.errors = errors;
      this.callback = callback;
      this.openError = true;
    });
    EventBus.$on(OPEN_HARDWARE_PASSWORD, (deviceInfo, callback) => {
      this.callback = callback;
      this.deviceInfo = deviceInfo;
      this.openHardwarePassword = true;
    });
  },
  methods: {
    reset() {
      this.deviceInfo = {};
      this.callback = () => {};
      this.identifier = '';
      this.openHardwarePassword = false;
      this.openError = false;
      this.password = '';
      this.acceptTerms = false;
    },
    submit() {
      this.callback(this.password);
      this.reset();
    },
    setPassword(e) {
      this.password = e;
    },
    setTerms(e) {
      this.acceptTerms = e;
    },
    send(bool) {
      this.callback(bool);
      this.reset();
    }
  }
};
</script>
