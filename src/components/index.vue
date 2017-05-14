<template>
  <md-layout md-gutter="24">
    <span>{{text}}</span>
  </md-layout>
</template>

<script>
export default {
  name: 'index',
  data: () => {
    return {
      text: ''
    }
  }
}
</script>
