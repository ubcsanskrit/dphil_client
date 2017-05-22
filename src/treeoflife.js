import * as d3 from 'd3'
import store from './store'

export function phylogram (selector, tree, params) {
  let defaults = {
    outerRadius: 400,
    innerRadius: 200,
    showLengths: true
  }
  let p = _.merge({}, defaults, params)

  let statsList = []
  _.forOwn(tree.stats, function (value, key) { statsList.push(`${_.startCase(key)}: ${value}`) })

  let color = d3.scaleOrdinal()
      .domain(statsList)
      .range(d3.schemeCategory10)

  // Compute the maximum cumulative length of any node in the tree.
  function maxLength (d) {
    return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0)
  }

  // Set the radius of each node by recursively summing and scaling the distance from the root.
  function setRadius (d, y0, k) {
    d.radius = (y0 += d.data.length) * k
    _.forEach(d.children, function (d) { setRadius(d, y0, k) })
  }

  // Set the color of each node by recursively inheriting.
  /*
  function setColor (d) {
    var name = d.data.name
    d.color = color.domain().indexOf(name) >= 0 ? color(name) : d.parent ? d.parent.color : null
    if (d.children) d.children.forEach(setColor)
  }
  */

  function linkVariable (d) {
    return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius)
  }

  function linkConstant (d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y)
  }

  function linkExtensionVariable (d) {
    return linkStep(d.target.x, d.target.radius, d.target.x, p.innerRadius)
  }

  function linkExtensionConstant (d) {
    return linkStep(d.target.x, d.target.y, d.target.x, p.innerRadius)
  }

  function labelVariable (d) {
    return 'rotate(' + (d.x - 90) + ')translate(' + (d.radius + 0.5) + ', 0)' + (d.x < 180 ? '' : 'rotate(180)')
  }

  function labelConstant (d) {
    return 'rotate(' + (d.x - 90) + ')translate(' + (d.y + 0.5) + ', 0)' + (d.x < 180 ? '' : 'rotate(180)')
  }

  // Like d3.svg.diagonal.radial, but with square corners.
  function linkStep (startAngle, startRadius, endAngle, endRadius) {
    let c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI)
    let s0 = Math.sin(startAngle)
    let c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI)
    let s1 = Math.sin(endAngle)
    return 'M' + startRadius * c0 + ',' + startRadius * s0 +
        (endAngle === startAngle ? '' : 'A' + startRadius + ',' + startRadius + ' 0 0 ' + (endAngle > startAngle ? 1 : 0) + ' ' + startRadius * c1 + ',' + startRadius * s1) +
        'L' + endRadius * c1 + ',' + endRadius * s1
  }

  let cluster = d3.cluster()
      .size([360, p.innerRadius])
      .separation(_.constant(1))

  let svg = d3.select(selector).append('svg')
      .attr('width', '100vw')
      .attr('height', '100vw')
      .attr('viewBox', `-${p.outerRadius * 1.5} -${p.outerRadius * 0.75} ${p.outerRadius * 3} ${p.outerRadius * 1.5}`)

  let legend = svg.append('g')
      .attr('class', 'legend')
      .selectAll('g')
      .data(color.domain())
      .enter().append('g')
      .attr('transform', function (d, i) { return `translate(-${p.outerRadius}, ${i * 20 + (p.innerRadius * 0.8)})` })

  /*
  legend.append('rect')
      .attr('x', -18)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', color)
  */

  legend.append('text')
        .attr('x', -24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .text(function (d) { return d })

  let chart = svg.append('g')
      // .attr('transform', 'translate(' + outerRadius + ',' + (outerRadius / 1.5) + ')')

  // let root = d3.hierarchy(nodes, function (d) { return d.children })
  //     .sum(function (d) { return d.children ? 0 : 1 })
  //     .sort(function (a, b) { return (a.value - b.value) || d3.ascending(a.data.length, b.data.length) })

  let root = tree.hierarchy
  cluster(root)

  setRadius(root, root.data.length = 0, p.innerRadius / maxLength(root))
  // setColor(root)

  let linkExtension = chart.append('g')
      .attr('class', 'link-extensions')
      .selectAll('path')
      .data(_.reject(root.links(), 'target.children'))
      .enter().append('path')
      .each(function (d) { d.target.linkExtensionNode = this })
      .attr('d', p.showLengths ? linkExtensionVariable : linkExtensionConstant)

  let link = chart.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(root.links())
      .enter().append('path')
      .each(function (d) { d.target.linkNode = this })
      .attr('d', p.showLengths ? linkVariable : linkConstant)
      .attr('stroke', function (d) { return d.target.color })

  chart.append('g')
      .attr('class', 'labels leaves')
      .selectAll('text')
      .data(root.leaves())
      .enter().append('text')
      .attr('dy', '.31em')
      .attr('transform', function (d) { return 'rotate(' + (d.x - 90) + ')translate(' + (d.y + 4) + ', 0)' + (d.x < 180 ? '' : 'rotate(180)') })
      .attr('text-anchor', function (d) { return d.x < 180 ? 'start' : 'end' })
      .text(function (d) { return _.replace(d.data.name, /_/g, ' ') })
      .attr('data-node-id', function (d) { return d.data.id })
      .on('mouseover', mouseovered(true))
      .on('mouseout', mouseovered(false))
      .on('click', selectNode(this))

  let intermediates = chart.append('g')
       .attr('class', 'labels intermediate')
       .selectAll('text')
       .data(_.filter(root.descendants(), 'children'))
       .enter().append('text')
       .attr('dy', '.31em')
       .attr('transform', p.showLengths ? labelVariable : labelConstant)
       .attr('text-anchor', function (d) { return d.x < 180 ? 'start' : 'end' })
       .text(function (d) { return _.replace(d.data.name, /_/g, ' ') })
       .attr('data-node-id', function (d) { return d.data.id })
       .on('mouseover', mouseovered(true))
       .on('mouseout', mouseovered(false))
       .on('click', selectNode(this))

  function updateLengths () {
    var t = d3.transition().duration(750)
    linkExtension.transition(t).attr('d', p.showLengths ? linkExtensionVariable : linkExtensionConstant)
    link.transition(t).attr('d', p.showLengths ? linkVariable : linkConstant)
    intermediates.transition(t).attr('transform', p.showLengths ? labelVariable : labelConstant)
  }

  function mouseovered (active) {
    return function (d) {
      d3.select(this).classed('label--active', active)
      d3.select(d.linkExtensionNode).classed('link-extension--active', active).each(moveToFront)
      do {
        d3.select(d.linkNode).classed('link--active', active).each(moveToFront)
        d = d.parent
      } while (d)
    }
  }

  function updateSelected () {
    let id = store.state.data.selectedNodeId
    if (_.isNil(id)) {
      store.commit('data/selectedNodeId', root.data.id)
    }

    d3.selectAll('text')
    .classed('label--selected', false)

    d3.select(`[data-node-id='${id}']`)
    .classed('label--selected', true)
  }
  updateSelected()

  function selectNode () {
    return (d) => {
      store.commit('data/selectedNodeId', _.get(d, 'data.id'))
      updateSelected()
    }
  }

  function moveToFront () {
    this.parentNode.appendChild(this)
  }

  return {
    root,
    update (params) {
      if (_.has(params, 'showLengths') && params.showLengths !== p.showLengths) {
        p.showLengths = params.showLengths
        updateLengths()
      }
      updateSelected()
    }
  }
}
