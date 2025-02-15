<template>
  <div class="table-component" :class="containerClass" :style="containerStyle">
    <div v-if="title" class="font-weight-bold mt-6 ml-5 mb-10">{{ title }}</div>
    <slot />
    <div v-if="loading" class="skeleton-loader-container">
      <div v-for="n in Number(loaderCount)" :key="n">
        <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableComponent',
  components: {},
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    },
    hoverEffect: {
      type: Boolean,
      default: false
    },
    background: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    loaderCount: {
      type: [String, Number],
      default: 1
    },
    borderAround: {
      type: Boolean,
      default: false
    },
    divider: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    paddingAround: {
      type: Boolean,
      default: false
    },
    paddingSide: {
      type: Boolean,
      default: false
    },
    roundCorner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    containerStyle() {
      return {
        display: this.fullWidth ? 'block' : 'inline-block'
      };
    },
    containerClass() {
      return [
        this.hoverEffect ? 'hover-effect' : '',
        this.background ? 'alteranting-background' : '',
        this.borderAround ? 'border-around' : '',
        this.roundCorner ? 'round-corner' : '',
        this.loading ? 'loading' : '',
        this.flat ? '' : 'box-shadow',
        this.divider ? 'divider' : '',
        this.paddingAround ? 'padding-around' : '',
        this.paddingSide ? 'padding-side' : ''
      ];
    }
  }
};
</script>

<style lang="scss">
.table-component {
  // Force style Vuetify skeleton loader
  .v-skeleton-loader__heading {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.skeleton-loader-container {
  & > div {
    display: flex;
    align-items: center;
    height: 58px;
    padding: 0px 20px;
  }
}

// Default styles
.table-component {
  --bg-color: #f4f7fe;
  --hover-color: #eaeffb;
  --border-color: #e0e5f2;
  --shadow-color: rgba(0, 0, 0, 0.15);
  table {
    border-collapse: collapse;
    width: 100%;
    thead {
      border-bottom: 1px solid var(--border-color);
      font-size: 12px;
      color: #76848b;
      font-weight: 500;
    }
    td {
      height: 58px;
      padding: 0px 20px;
    }
  }
}

// Options by props
.box-shadow {
  box-shadow: 0 2px 6px var(--shadow-color);
}
.border-around {
  border: 1px solid var(--border-color);
}
.hover-effect {
  tbody {
    tr:hover {
      background-color: var(--hover-color) !important;
    }
  }
}
.alteranting-background {
  tbody {
    tr:nth-child(odd) {
      background-color: var(--bg-color);
    }
  }
}
.loading {
  tbody {
    display: none;
  }
}
.divider {
  tbody {
    tr:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }
  }
}
.padding-around {
  padding: 10px 15px 15px 15px;
}

.padding-side {
  padding: 0px 15px;
}
.round-corner {
  border-radius: 8px;
  overflow: hidden;
}
</style>
