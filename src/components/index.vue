<template>
  <md-layout md-gutter md-align="center">
    <md-layout md-flex="90">
      <h2 class="md-title">Menu</h2>
    </md-layout>
    <md-layout md-flex="90">
      <md-list style="flex: 1;">
        <md-list-item>
          <router-link to="tree">
            <md-icon>call_split</md-icon>
            <span>View Tree</span>
          </router-link>
        </md-list-item>
      </md-list>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'index'
}
</script>
