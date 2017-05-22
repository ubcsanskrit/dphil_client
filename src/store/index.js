import { remote } from 'electron'
import Vue from 'vue/dist/vue.common'
import Vuex from 'vuex'

import { loadDataFromFile } from './datafiles'

Vue.use(Vuex)

const dataModule = {
  namespaced: true,
  state: {
    changed: false,
    openFile: null,
    treeData: {},
    selectedTreeId: null,
    selectedNodeId: null,
    matrixCharacters: {},
    matrixTaxa: {},
    reconstructed: {},
    navCharsPerPage: 8,
    navCharStart: 1
  },
  mutations: {
    openFile (state, filePath) {
      Vue.set(state, 'openFile', filePath)
    },
    treeData (state, treeData) {
      Vue.set(state, 'treeData', treeData)
    },
    selectedTreeId (state, id) {
      state.selectedTreeId = id
    },
    selectedNodeId (state, id) {
      state.selectedNodeId = id
    },
    matrixCharacters (state, characters) {
      Vue.set(state, 'matrixCharacters', characters)
    },
    matrixTaxa (state, taxa) {
      state.matrixTaxa = taxa
    },
    changed (state, value) {
      state.changed = !!value
    },
    reconstructed (state, {rootId, charId, value}) {
      if (_.isUndefined(state.reconstructed[rootId])) {
        Vue.set(state.reconstructed, rootId, {})
      }
      if (_.isNil(value)) {
        Vue.delete(state.reconstructed[rootId], charId)
      } else {
        Vue.set(state.reconstructed[rootId], charId, value)
      }
    },
    navCharsPerPage (state, value) {
      state.navCharsPerPage = value
    },
    navCharStart (state, value) {
      state.navCharStart = value
    }
  },
  getters: {
    numTrees (state) {
      return _.size(state.treeData)
    },
    selectedTree (state) {
      return _.get(state.treeData, state.selectedTreeId) || {}
    },
    selectedTreeNodes (state, getters) {
      return _.get(getters.selectedTree, 'nodes')
    },
    selectedNode (state, getters) {
      return _.get(getters.selectedTree, `nodes.${state.selectedNodeId}`)
    },
    nodesFromCurrent (state, getters) {
      if (!_.isNil(getters.selectedNode)) {
        return getters.selectedNode.descendants()
      }
    },
    taxaFromCurrent (state, getters) {
      let newRoot = getters.selectedNode
      if (_.isNil(newRoot)) { return }
      return _.keyBy(newRoot.leaves(), (node) => node.data.id)
    },
    matrixSliceChars (state, getters) {
      if (_.get(state.selectedTree, 'hierarchy') === getters.selectedNode) {
        return state.matrixCharacters
      }
      return _.mapValues(state.matrixCharacters, (char, id) => {
        return char.filterData({nodes: _.keys(getters.taxaFromCurrent)})
      })
    },
    numChars (state, getters) {
      return _.size(getters.matrixSliceChars)
    },
    reconstructedCurrent (state, getters) {
      return state.reconstructed[state.selectedNodeId] || {}
    }
  },
  actions: {
    loadDataFile ({commit, state}, filePath) {
      if (state.changed) {
        let result = remote.dialog.showMessageBox({
          type: 'question',
          message: 'Are you sure you want to load new data? Any unsaved changes will be lost.',
          buttons: ['Yes', 'No'],
          defaultId: 1,
          cancelId: 1
        })
        if (result === 1) { return }
      }
      let newData = loadDataFromFile(filePath)
      commit('openFile', newData.openFile)
      commit('treeData', newData.treeData)
      commit('selectedTreeId', _.keys(state.treeData)[0])
      commit('selectedNodeId', _.get(state.treeData, `${state.selectedTreeId}.rootId`))
      commit('matrixCharacters', newData.matrix.characters)
      commit('matrixTaxa', newData.matrix.taxaNames)
      commit('changed', false)
    }
  }
}

export default new Vuex.Store({
  state: {
    headerText: 'Welcome!'
  },
  mutations: {
    headerText (state, newText) {
      state.headerText = newText
    }
  },
  modules: {
    data: dataModule
  }
})
