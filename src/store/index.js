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
    currentTree: null
  },
  mutations: {
    openFile (state, filePath) {
      state.openFile = filePath
    },
    treeData (state, treeData) {
      state.treeData = treeData
    },
    treeStats (state, treeStats) {
      state.treeStats = treeStats
    },
    changed (state, value) {
      state.changed = !!value
    },
    currentTree (state, id) {
      state.currentTree = id
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
      let firstTreeId = _.keys(state.treeData)[0]
      commit('currentTree', firstTreeId)
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
