<template>
<md-table-cell class="reading-select-cell">
  <md-input-container>
    <md-select :name="`rc${charIndex}`" :id="`rc${charIndex}`" :key="`rc${charIndex}`" v-model="currentState"
      @input="updateSelect">
      <md-option :value="null" :class="charConsensus[bestState].class" >
        * {{bestState}}
      </md-option>
      <md-option :value="state" :class="char.class" v-for="(char, state) in charConsensus">
        {{state}}
      </md-option>
    </md-select>
  </md-input-container>
</md-table-cell>
</template>

<style>

.reading-select-cell select {
  font-weight: 500;
}

.default {
  font-weight: 400;
  font-style: italic;
}

.prev-100 {
  background-color: hsla(120, 100%, 75%, 1);
}

.prev-75 {
  background-color: hsla(90, 100%, 75%, 1);
}

.prev-50 {
  background-color: hsla(60, 100%, 75%, 1);
}

.prev-25 {
  background-color: hsla(30, 100%, 75%, 1);
}

.prev-0 {
  background-color: hsla(0, 100%, 75%, 1);
}
</style>

<script>

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'readingSelector',
  props: ['charIndex'],
  computed: {
    ...mapState('data', {
      selectedNodeId: 'selectedNodeId'
    }),
    ...mapGetters('data', {
      characters: 'matrixSliceChars',
      taxa: 'taxaFromCurrent',
      reconstructed: 'reconstructedCurrent'
    }),
    charConsensus () {
      let char = this.characters[this.charIndex]
      let totalTaxa = _.size(this.taxa)
      let accountedTaxa = 0
      let consensus = {}
      _.forEach(char.symbols, (symbol, state) => {
        let total = _.toInteger(char.stateTotals[state])
        accountedTaxa += total
        let prevalence = _.round(total / totalTaxa, 2)
        let prevGroup = (_.round(prevalence * 4) / 4) * 100
        let className = `prev-${prevGroup}`
        consensus[state] = {
          symbol,
          class: className,
          state,
          total,
          prevalence
        }
      })
      if (accountedTaxa < totalTaxa) {
        let total = totalTaxa - accountedTaxa
        let prevalence = _.round(total / totalTaxa, 2)
        let prevGroup = (_.round(prevalence * 4) / 4) * 100
        let className = `prev-${prevGroup}`
        consensus[''] = {
          symbol: '-',
          state: '',
          class: className,
          total,
          prevalence
        }
      }
      return consensus
    },
    bestState () {
      let state = _.maxBy(_.keys(this.charConsensus), (o) => {
        return this.charConsensus[o].total
      })
      return this.charConsensus[state].state
    },
    currentState () {
      if (!_.isNil(this.reconstructed[this.charIndex])) {
        return this.reconstructed[this.charIndex]
      }
      return null
    }
  },
  methods: {
    updateSelect (value) {
      if (this.currentState !== value) {
        this.$store.commit('data/reconstructed', {
          rootId: this.selectedNodeId,
          charId: this.charIndex,
          value: value
        })
      }
      let element = document.getElementById(`rc${this.charIndex}`).closest('.md-table-cell-container')

      element.classList.remove('default', 'prev-0', 'prev-25', 'prev-50', 'prev-75', 'prev-100')
      if (_.isNil(value)) {
        element.classList.add(this.charConsensus[this.bestState].class, 'default')
      } else {
        element.classList.add(this.charConsensus[value].class)
      }
    }
  }
}
</script>
