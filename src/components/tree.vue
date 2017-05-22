<template>
<md-layout class="main-content" md-flex md-column>
  <md-layout md-row style="flex: 0 0 48px">
    <md-layout class="field-group" md-flex md-row>
      <md-layout md-flex-offset="5" style="flex: 0 0 auto">
        <md-input-container>
          <label for="selectedTreeId">Tree ID</label>
          <md-select name="selectedTreeId" id="selectedTreeId" v-model="selectedTreeId"
                     @change="updateTreeView" @input="setCurrentTree">
            <md-option :value="treeId"  v-for="(tree, treeId) in treeData">
                {{treeId}}
            </md-option>
          </md-select>
          <span>({{numTrees}})</span>
        </md-input-container>
      </md-layout>
      <md-layout md-flex-offset="5">
        <md-checkbox id="showLengths" name="showLengths"
                     v-model="showLengths">Branch Lengths</md-checkbox>
      </md-layout>
    </md-layout>
  </md-layout>
  <md-layout id="tree" md-flex></md-layout>
</md-layout>
</template>

<style>
svg {
  font-style: normal;
}

svg * {
  user-select: none;
}

.links {
  fill: none;
  stroke: #000;
}

.link-extensions {
  fill: none;
  stroke: #333;
  stroke-opacity: 0.25;
}

text.labels {
  font-face: "Roboto";
  font-weight: 500;
  font: 12px;
}

text.labels:hover {
  cursor: pointer;
}

text.label--selected {
  font-weight: 700;
  fill: blue !important;
}

.link--active {
  stroke: red;
  stroke-width: 1.5px;
}

.link-extension--active {
  stroke-opacity: .6;
  stroke: darkred !important;
}

text.label--active:hover {
  font-weight: 700;
  fill: red;
  cursor: pointer;
}
</style>

<script>

import { mapState, mapGetters } from 'vuex'
import { phylogram } from '../treeoflife'

export default {
  name: 'tree',
  data: function () {
    return {
      headerText: 'Tree View',
      showLengths: false,
      currentPhylogram: null
    }
  },
  computed: {
    ...mapState('data', {
      treeData: 'treeData',
      selectedTreeId: 'selectedTreeId',
      selectedNodeId: 'selectedNodeId'
    }),
    ...mapGetters('data', {
      numTrees: 'numTrees',
      selectedTree: 'selectedTree'
    })
  },
  methods: {
    setCurrentTree (treeId) {
      if (this.selectedTreeId !== treeId) {
        this.$store.commit('data/selectedNodeId', null)
        this.$store.commit('data/selectedTreeId', treeId)
      }
    },
    updateTreeView () {
      if (_.isNil(this.selectedTree)) { return }
      let treeBox = document.getElementById('tree')
      if (!_.isNil(treeBox)) { treeBox.innerHTML = '' }
      this.currentPhylogram = phylogram('#tree', this.selectedTree,
        { showLengths: this.showLengths })
    }
  },
  watch: {
    showLengths (newVal) {
      if (!_.isNil(this.currentPhylogram)) {
        this.currentPhylogram.update({ showLengths: newVal })
      }
    }
  },
  mounted () {
    if (this.$parent.$el.id === 'app') {
      this.$store.commit('headerText', this.headerText)
    }
  }
}
</script>
