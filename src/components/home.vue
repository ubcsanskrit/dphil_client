<template>
<md-layout class="main-content" md-column>
  <md-layout style="flex: 0 0 auto">
    <span class="md-subheading">File Loaded: `{{fileLoaded}}`</span>
  </md-layout>
</md-layout>
</template>

<script>

export default {
  name: 'index',
  data: function () {
    return {
      headerText: 'Home'
    }
  },
  computed: {
    fileLoaded: function () {
      return this.$store.state.data.openFile
    }
  },
  mounted () {
    if (this.$parent.$el.id === 'app') {
      this.$store.commit('headerText', this.headerText)
    }
  }
}
</script>
