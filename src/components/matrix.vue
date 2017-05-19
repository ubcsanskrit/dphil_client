<template>
<md-layout class="main-content" md-column>
  <md-layout style="flex: 0 0 auto">
  </md-layout>
</md-layout>
</template>

<script>

export default {
  name: 'index',
  data: function () {
    return {
      headerText: 'Matrix View'
    }
  },
  mounted () {
    if (this.$parent.$el.id === 'app') {
      this.$store.commit('headerText', this.headerText)
    }
  }
}
</script>
