<template>
<div class="app">
  <div class="header">
    <md-toolbar>
      <h1 class="md-title">{{header}}</h1>
    </md-toolbar>
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
