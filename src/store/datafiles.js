import fs from 'fs'
import path from 'path'
import * as d3 from 'd3'
import MatrixCharacter from '../classes/character'

function parseNode (nodeId, nodes) {
  let node = nodes[nodeId]
  let out = {
    id: _.get(node, 'id', nodeId),
    name: _.get(node, 'name', '')
  }

  let length = parseFloat(node.length)
  if (length > 0) { out.length = length }

  let children = _.map(node.children, function parseNodeChildren (childId) {
    return parseNode(childId, nodes)
  })
  if (!_.isEmpty(children)) { out.children = children }

  return out
}

function parseTrees (trees) {
  if (!_.isPlainObject(trees)) { return {} }
  return _.mapValues(trees, function parseOneTree (tree, index) {
    let hierarchy = d3.hierarchy(parseNode(tree.rootId, tree.nodes), (d) => d.children)
      .sum((d) => d.children ? 0 : 1)
      .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length))
    return {
      rootId: tree.rootId,
      nodes: _.keyBy(hierarchy.descendants(), (val) => val.data.id),
      stats: tree.stats,
      hierarchy
    }
  })
}

export function loadDataFromFile (filePath) {
  filePath = path.normalize(path.resolve(filePath))
  console.debug(filePath)

  let data
  try {
    data = fs.readFileSync(filePath, {encoding: 'utf-8'})
    console.log(`loaded file ${filePath}`)
  } catch (err) {
    return console.error(`could not read file ${filePath}`)
  }

  let jsonData
  try {
    jsonData = JSON.parse(data)
    console.info(`parsed JSON data`)
  } catch (err) {
    return console.error(`error parsing JSON data: ${err}`)
  }

  let newData = {
    openFile: filePath
  }

  if (_.has(jsonData, 'trees')) {
    newData.treeData = parseTrees(jsonData.trees)
    newData.treeStats = _.mapValues(jsonData.trees, 'stats')
  }

  if (_.has(jsonData, 'matrix')) {
    newData.matrix = jsonData.matrix
    newData.matrix.characters = _.mapValues(newData.matrix.characters, (char, id) => {
      return new MatrixCharacter(char)
    })
  }

  return newData
}
