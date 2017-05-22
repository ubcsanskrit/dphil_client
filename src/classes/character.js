export default class MatrixCharacter {
  constructor (data) {
    this.id = _.get(data, 'id')
    this.symbols = _.get(data, 'symbols') || {}
    this.symbols[''] = '-'
    this.taxaStates = _.get(data, 'taxaStates') || {}
    if (_.isNil(this.id)) {
      throw new Error('Requires id.')
    }
    this.stateTotals = _.reduce(this.taxaStates, (acc, state, taxon) => {
      if (_.isNil(acc[state])) { acc[state] = 0 }
      acc[state] += 1
      return acc
    }, {})
    if (!_.has(this.stateTotals, '')) { this.stateTotals[''] = 0 }
  }

  filterData (filterData) {
    if (!_.isNil(filterData)) {
      let newSymbols = this.symbols
      let newTaxaStates = this.taxaStates
      _.forEach(filterData.taxaStates, (state, taxon) => {
        if (!_.has(newSymbols, state)) { newSymbols[state] = '*' }
        newTaxaStates[taxon] = state
      })

      if (!_.isNil(filterData.nodes) && !_.isEmpty(filterData.nodes)) {
        newTaxaStates = _.reduce(filterData.nodes, (acc, node) => {
          let nodeId = _.get(node, 'data.id') || _.get(node, 'id') || node
          if (_.has(newTaxaStates, nodeId)) {
            acc[nodeId] = newTaxaStates[nodeId]
          }
          return acc
        }, {})
      }

      let newData = {
        id: this.id,
        symbols: newSymbols,
        taxaStates: newTaxaStates
      }
      return new MatrixCharacter(newData)
    }
  }
}
