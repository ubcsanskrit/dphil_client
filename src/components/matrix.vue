<template>
<md-layout class="main-content" md-column>
  <md-layout style="flex: 1">
    <md-table class="characters" style="flex: 1" v-if="!_.isEmpty(characters)">
      <colgroup>
        <col span="1" class="first-column">
      </colgroup>
      <md-table-header>
        <md-table-row>
          <md-table-head>Manuscript</md-table-head>
          <md-table-head
            v-for="cindex in _.range(navCharStart, navCharStart + navCharsPerPage)">
            #{{cindex}}
          </md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="(name, tindex) in taxa" v-bind:key="`row-${tindex}`">
          <md-table-cell class="taxaName" v-bind:key="`t${tindex}`"><strong>({{ tindex }}) {{ name }}</strong></md-table-cell>
          <md-table-cell class="character"
            v-for="cindex in _.range(navCharStart, navCharStart + navCharsPerPage)"
            v-bind:key="`${tindex}-${cindex}`">
            {{ characters[cindex].taxaStates && characters[cindex].taxaStates[tindex] }}
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </md-layout>
  <matrixNav />
</md-layout>
</template>

<style>

.first-column {
  background-color: #f5f5f5;
}

.md-table table {
  min-height: 100%;
}

.md-table td {
  white-space: nowrap;
}

.md-table .md-table-cell {
  min-height: 24px;
  height: auto;
  max-height: 48px;
}

.md-table .md-table-cell .md-table-cell-container,
.md-table .md-table-head-text {
  padding: 4px 12px 4px 12px;
}

.md-table .md-table-cell.character .md-table-cell-container,
.md-table .md-table-head-container,
.md-table .md-table-head-text  {
  text-align: left;
}

.md-table .md-table-cell.taxaName .md-table-cell-container {
  text-align: left;
}

</style>

<script>

import { mapState } from 'vuex'
import MatrixNav from './matrixnav'

export default {
  name: 'matrix',
  components: { MatrixNav },
  data: function () {
    return {
      headerText: 'Matrix View'
    }
  },
  computed: {
    ...mapState('data', {
      characters: 'matrixCharacters',
      taxa: 'matrixTaxa',
      navCharStart: 'navCharStart',
      navCharsPerPage: 'navCharsPerPage'
    })
  },
  mounted () {
    if (this.$parent.$el.id === 'app') {
      this.$store.commit('headerText', this.headerText)
    }
  }
}
</script>
