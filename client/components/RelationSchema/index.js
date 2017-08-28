/**
 * Created by Administrator on 2017/8/23.
 */

import React from 'react'
import G6 from '@antv/g6'

let uniqueId = 0
function generateUniqueId() {
  return `rc-g6-${uniqueId++}`
}

export default class Component extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.graph = null
    this.graphId = generateUniqueId()
  }

  componentDidMount() {
    this.initGraph(this.props)
  }

  componentWillReceiveProps(newProps) {
    const { width: newWidth, height: newHeight } = newProps
    const { width: oldWidth, height: oldHeight } = this.props

    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.graph.changeSize(newWidth, newHeight)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillUnmount() {
    this.graph = null
    this.graphId = null
  }

  initGraph() {
    const data = {
      nodes: [
        {
          id: 'node1',
          x: 100,
          y: 160,
        },
        {
          id: 'node2',
          x: 290,
          y: 160,
        },
      ],
      edges: [
        {
          id: 'node1-node2',
          target: 'node1',
          source: 'node2',
        },
      ],
    }
    const net = new G6.Net({
      id: 'c1', // 容器ID
      height: 450, // 画布高
      // width: 500, // 画布宽
    })
    net.source(data.nodes, data.edges)
    net.render()
    net.on('itemclick', function(ev) {
      console.log('击中' + ev.item.get('model').id + '!')
    })
    net.on('itemmousedown', function(ev) {
      const item = ev.item
      if (net.isNode(item)) {
        net.update(item, {
          shape: 'circle',
        })
        net.refresh()
      }
    })
    net.on('itemmouseup', function(ev) {
      const item = ev.item
      if (net.isNode(item)) {
        net.update(item, {
          shape: 'rect',
        })
        net.refresh()
      }
    })
    net.on('itemmouseenter', function(ev) {
      const item = ev.item
      net.update(item, {
        color: 'red',
      })
      net.refresh()
    })
    net.on('itemmouseleave', function(ev) {
      const item = ev.item
      net.update(item, {
        color: null,
      })
      net.refresh()
    })
  }

  render() {
    return (<div id="c1"></div>)
  }
}

