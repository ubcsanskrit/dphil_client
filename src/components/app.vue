<template>
<div class="app">
  <div class="header">
    <mv-layout mv-flex>
      <md-toolbar style="flex: 1">
        <h2 class="md-title" style="flex: 1;">{{header}}</h2>
        <router-link to="/" class="md-button" :class="`md-theme-${$material.currentTheme}`">
          <md-icon>home</md-icon>
        </router-link>
      </md-toolbar>
    </mv-layout>
  </div>
  <div class="page">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
export default {
  name: 'app',
  data: () => {
    return {
      header: ''
    }
  }
}
</script>
