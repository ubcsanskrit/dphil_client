<template>
<md-layout class="main-content" md-column>
  <md-layout style="flex: 1">
    <md-table class="characters">
      <md-table-header>
        <md-table-row>
          <md-table-head>Manuscript</md-table-head>
          <md-table-head v-for="(char, cindex) in characters" v-bind:key="`col-${cindex}`">#{{ cindex }}</md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="(name, tindex) in taxa" v-bind:key="`row-${index}`">
          <md-table-cell v-bind:key="`t${tindex}`"><strong>({{ tindex }}) {{ name }}</strong></md-table-cell>
          <md-table-cell v-for="(char, cindex) in characters" v-bind:key="`${tindex}-${cindex}`">{{ char.taxaStates && char.taxaStates[tindex] }}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </md-layout>
</md-layout>
</template>

<style>

.md-table {
  overflow: visible;
}

.characters td {
  white-space: nowrap;
}

</style>

<script>

import * as _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'index',
  data: function () {
    return {
      headerText: 'Matrix View'
    }
  },
  computed: {
    ...mapState('data', {
      characters: 'matrixCharacters',
      taxa: 'matrixTaxa'
    })
  },
  mounted () {
    if (this.$parent.$el.id === 'app') {
      this.$store.commit('headerText', this.headerText)
    }
  }
}
</script>
