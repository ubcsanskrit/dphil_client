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
    treeStats: {},
    currentTree: null,
    currentNode: null,
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
    treeStats (state, treeStats) {
      Vue.set(state, 'treeStats', treeStats)
    },
    currentTree (state, id) {
      state.currentTree = id
    },
    currentNode (state, id) {
      state.currentNode = id
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
    navCharsPerPage (state, value) {
      state.navCharsPerPage = value
    },
    navCharStart (state, value) {
      state.navCharStart = value
    }
  },
  getters: {
    currentTreeData (state) {
      return state.treeData[state.currentTree]
    },
    currentNodeData (state, getters) {
      return getters.currentTreeData
    },
    leavesForCurrent (state, getters) {
      return getters.currentNodeData
    },
    matrixSliceChars (state, getters) {
      if (state.currentTreeData === state.currentNodeData) {
        return state.matrixCharacters
      }
      return 'nonRoot'
    },
    matrixSliceTaxa (state, getters) {
      if (state.currentTreeData === state.currentNodeData) {
        return state.matrixTaxa
      }
      return 'nonRoot'
    },
    numChars (state, getters) {
      return _.size(getters.matrixSliceChars)
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
      commit('treeStats', newData.treeStats)
      commit('currentTree', _.keys(state.treeData)[0] || null)
      commit('currentNode', _.get(state.treeData, `${state.currentTree}.id`) || null)
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
