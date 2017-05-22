<template>
<md-layout class="matrix-navigation" md-flex md-align="center">
  <md-button class="md-fab md-clean md-mini" @click.native="decrementNavCharsPerPage">
    <md-icon>remove_circle_outline</md-icon>
    <md-tooltip md-delay="400" md-direction="top">Show -1 character per page</md-tooltip>
  </md-button>

  <md-input-container md-inline style="flex: 0 0 32px;">
    <md-input readonly v-model="navCharsPerPage"></md-input>
  </md-input-container>

  <md-button class="md-fab md-clean md-mini" @click.native="incrementNavCharsPerPage">
    <md-icon>add_circle_outline</md-icon>
    <md-tooltip md-delay="400" md-direction="top">Show +1 character per page</md-tooltip>
  </md-button>

  <div class="lg-separator"/>

  <md-button class="md-fab md-clean md-mini" @click.native="backAll">
    <md-icon>first_page</md-icon>
    <md-tooltip md-delay="400" md-direction="top">Back to the first character</md-tooltip>
  </md-button>

  <div class="sm-separator"/>

  <md-button class="md-fab md-clean md-mini" @click.native="backPage">
    <md-icon>arrow_back</md-icon>
    <md-tooltip md-delay="400" md-direction="top">Back one page ({{navCharsPerPage}} characters)</md-tooltip>
  </md-button>

  <md-button class="md-fab md-clean md-mini" @click.native="backOne">
    <md-icon>chevron_left</md-icon>
  </md-button>

  <md-layout class="nav-info" md-column md-align="center">
    Showing {{navCharStart}}&ndash;{{navCharStart + navCharsPerPage - 1}}<br />
    (of {{numChars}})
  </md-layout>

  <md-button class="md-fab md-clean md-mini" @click.native="forwardOne">
    <md-icon>chevron_right</md-icon>
  </md-button>

  <md-button class="md-fab md-clean md-mini" @click.native="forwardPage">
    <md-icon>arrow_forward</md-icon>
    <md-tooltip md-delay="400" md-direction="top">Forward one page ({{navCharsPerPage}} characters)</md-tooltip>
  </md-button>

  <div class="sm-separator"/>

  <md-button class="md-fab md-clean md-mini" @click.native="forwardAll">
   <md-icon>last_page</md-icon>
   <md-tooltip md-delay="400" md-direction="top">Forward to the last character</md-tooltip>
  </md-button>
</md-layout>
</template>

<style>
.matrix-navigation {
  flex: 0 0 48px;
  margin-top: auto;
  margin-bottom: 0;
  border-top: 1px solid darkgrey;
}

.md-input-container {
  bottom: 6px;
  margin-bottom: 0;
}

.nav-info {
  flex: 0 0 128px;
  text-align: center;
  padding-top: 4px;
}

.sm-separator {
  display: flex;
  flex: 0 0 12px;
}

.lg-separator {
  display: flex;
  flex: 0 0 48px;
}

</style>

<script>

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'matrixNav',
  data: function () {
    return {
      listeners: [],
      maxCharsPerPage: 12
    }
  },
  computed: {
    ...mapState('data', {
      navCharStart: 'navCharStart'
    }),
    ...mapGetters('data', {
      characters: 'matrixSliceChars',
      taxa: 'matrixSliceTaxa',
      numChars: 'numChars'
    }),
    maxTarget () {
      if (_.isNil(this.numChars)) {
        return this.navCharsPerPage
      }
      return this.numChars - this.navCharsPerPage + 1
    },
    navCharsPerPage () {
      return this.$store.state.data.navCharsPerPage
    }
  },
  methods: {
    navigate (target) {
      return this.$store.commit('data/navCharStart', _.clamp(target, 1, this.maxTarget))
    },
    backAll () {
      this.navigate(1)
    },
    backPage () {
      this.navigate(this.navCharStart - this.navCharsPerPage)
    },
    backOne () {
      this.navigate(this.navCharStart - 1)
    },
    forwardAll () {
      this.navigate(this.maxTarget)
    },
    forwardPage () {
      this.navigate(this.navCharStart + this.navCharsPerPage)
    },
    forwardOne () {
      this.navigate(this.navCharStart + 1)
    },
    incrementNavCharsPerPage () {
      let newNavCharsPerPage = _.clamp(_.parseInt(this.navCharsPerPage) + 1, 1, this.maxCharsPerPage)
      this.$store.commit('data/navCharsPerPage', newNavCharsPerPage)
      this.navigate(this.navCharStart)
    },
    decrementNavCharsPerPage () {
      let newNavCharsPerPage = _.clamp(_.parseInt(this.navCharsPerPage) - 1, 1, this.maxCharsPerPage)
      return this.$store.commit('data/navCharsPerPage', newNavCharsPerPage)
    },
    processKeypress (event) {
      if (event.code === 'ArrowLeft') {
        event.shiftKey ? this.backPage() : this.backOne()
      } else if (event.code === 'ArrowRight') {
        event.shiftKey ? this.forwardPage() : this.forwardOne()
      }
    }
  },
  mounted: function () {
    window.addEventListener('keyup', this.processKeypress)
  },
  beforeDestroy: function () {
    window.removeEventListener('keyup', this.processKeypress)
  }
}
</script>
