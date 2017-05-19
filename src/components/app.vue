<template>
<md-layout class="app" id="app" md-flex md-column>
  <md-layout md-flex md-row style="flex: 0 0 64px">
    <md-toolbar style="flex: 1">
      <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h1 class="md-title" style="flex: 1;">{{headerText}}</h1>
    </md-toolbar>
  </md-layout>
  <router-view class="page"></router-view>
  <md-sidenav class="md-left" ref="leftSidenav" @open="open('Left')" @close="close('Left')">
    <md-toolbar>
      <div class="md-toolbar-container">
        <h3 class="md-title">Menu</h3>
      </div>
    </md-toolbar>
    <md-list>
      <md-list-item>
        <router-link to="/" exact>
          <md-icon>home</md-icon> <span>Home</span>
        </router-link>
      </md-list-item>

      <md-list-item>
        <router-link to="/tree" exact>
          <md-icon>send</md-icon> <span>Tree View</span>
        </router-link>
      </md-list-item>
    </md-list>
  </md-sidenav>
</md-layout>
</template>

<script>
export default {
  computed: {
    headerText () {
      return this.$store.state.headerText
    }
  },
  methods: {
    toggleLeftSidenav () {
      this.$refs.leftSidenav.toggle()
    },
    open: _.noop,
    close: _.noop
  }
}
</script>
