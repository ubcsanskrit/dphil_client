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
        <md-table-row>
          <md-table-cell><em>(Consensus)</em></md-table-cell>
          <template v-for="cindex in _.range(navCharStart, navCharStart + navCharsPerPage)">
            <reading-Selector :char-index="cindex"/>
          </template>
        </md-table-row>
        <md-table-row v-for="(node, tindex) in taxa" v-bind:key="`row-${tindex}`">
          <md-table-cell class="taxaName" v-bind:key="`t${tindex}`"><strong>({{ tindex }}) {{ node.data.name }}</strong></md-table-cell>
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

.md-table td .md-table-cell-container {
  white-space: normal;
  word-break: break-all;
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

import { mapState, mapGetters } from 'vuex'
import ReadingSelector from './reading_selector.vue'
import MatrixNav from './matrixnav'

export default {
  name: 'matrix',
  components: { MatrixNav, ReadingSelector },
  data: function () {
    return {
      headerText: 'Matrix View'
    }
  },
  computed: {
    ...mapState('data', {
      navCharStart: 'navCharStart',
      navCharsPerPage: 'navCharsPerPage'
    }),
    ...mapGetters('data', {
      characters: 'matrixSliceChars',
      taxa: 'taxaFromCurrent'
    })
  },
  mounted () {
    if (this.$parent.$el.id === 'app') {
      this.$store.commit('headerText', this.headerText)
    }
  }
}
</script>
