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
    currentTreeData (state) {
      return state.treeData[state.currentTree] || {}
    },
    currentTreeNodes (state, getters) {
      let nodes = {}
      function walkNode (node) {
        nodes[node.id] = node
        _.forEach(node.children, walkNode)
      }
      walkNode(getters.currentTreeData)
      return nodes
    },
    currentNodeData (state, getters) {
      return _.get(getters.currentTreeNodes, state.currentNode)
    },
    nodesFromCurrent (state, getters) {
      let nodes = {}
      function walkNode (node) {
        nodes[node.id] = node
        _.forEach(node.children, walkNode)
      }
      if (!_.isNil(getters.currentNodeData)) {
        walkNode(getters.currentNodeData)
      }
      return nodes
    },
    taxaFromCurrent (state, getters) {
      let taxa = {}
      _.forEach(getters.nodesFromCurrent, function (node) {
        if (_.isEmpty(node.children)) { taxa[node.id] = node.name }
      })
      return taxa
    },
    matrixSliceChars (state, getters) {
      if (getters.currentTreeData === getters.currentNodeData) {
        return state.matrixCharacters
      }
      let newChars = {}
      _.forEach(state.matrixCharacters, function (char, charId) {
        let id = char.id

        let states = {}
        let symbols = {}
        let taxaStates = {}
        let statesTaxa = {}
        let stateTotals = {}

        _.forEach(char.taxaStates, function (state, taxon) {
          if (_.has(getters.taxaFromCurrent, taxon)) {
            taxaStates[taxon] = state
            if (_.isUndefined(statesTaxa[state])) { statesTaxa[state] = [] }
            if (_.isUndefined(stateTotals[state])) { stateTotals[state] = 0 }
            statesTaxa[state].push(taxon)
            stateTotals[state] += 1
          }
        })

        _.forEach(char.states, function (state, symbol) {
          if (_.has(statesTaxa, state)) {
            states[symbol] = state
            symbols[state] = symbol
          }
        })

        newChars[id] = {
          id,
          states,
          symbols,
          taxaStates,
          statesTaxa,
          stateTotals
        }
      })
      return newChars
    },
    numChars (state, getters) {
      return _.size(getters.matrixSliceChars)
    },
    reconstructedCurrent (state, getters) {
      return state.reconstructed[state.currentNode] || {}
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
