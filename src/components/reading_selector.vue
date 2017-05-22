<template>
<md-table-cell v-bind="consensus">
  {{consensus.state}}
</md-table-cell>
</template>

<style>
.consensus-block.prev-100 {
  background-color: hsla(120, 100%, 75%, 1);
}

.consensus-block.prev-75 {
  background-color: hsla(90, 100%, 75%, 1);
}

.consensus-block.prev-50 {
  background-color: hsla(60, 100%, 75%, 1);
}

.consensus-block.prev-25 {
  background-color: hsla(30, 100%, 75%, 1);
}

.consensus-block.prev-0 {
  background-color: hsla(0, 100%, 75%, 1);
}
</style>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'readingSelector',
  props: ['charIndex'],
  computed: {
    ...mapGetters('data', {
      characters: 'matrixSliceChars',
      taxa: 'matrixSliceTaxa'
    }),
    consensus () {
      let char = this.characters[this.charIndex]
      let state = char.states['A']
      let total = char.stateTotals[state]
      let prevalence = _.round(total / _.size(this.taxa), 2)
      let prevGroup = (_.round(prevalence * 4) / 4) * 100
      let className = `consensus-block prev-${prevGroup}`
      return {
        class: className,
        state,
        total,
        prevalence
      }
    }
  }
}
</script>
