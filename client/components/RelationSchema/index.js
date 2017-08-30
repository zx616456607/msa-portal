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
          shape: 'customNode1',
          id: 'd62d1569',
          x: 100,
          y: 250,
          tooltip: true,
        },
        {
          shape: 'customNode2',
          id: 'd62s1569',
          x: 380,
          y: 250,
        },
      ],
      edges: [
        {
          shape: 'customEdge',
          source: 'd62d1569',
          target: 'd62s1569',
          id: '75ae90a8',
        },
      ],
    }
    G6.registNode('customNode1', {
      draw: (cfg, group) => {
        group.addShape('text', {
          attrs: {
            x: cfg.x - 50,
            y: cfg.y - 50,
            fill: '#333',
            text: '我是一个自定义node1',
          },
        })
        return group.addShape('rect', {
          attrs: {
            x: cfg.x - 50,
            y: cfg.y - 50,
            width: cfg.size,
            height: cfg.size,
            stroke: cfg.color,
          },
        })
      },
    })
    G6.registNode('customNode2', {
      draw: (cfg, group) => {
        group.addShape('text', {
          attrs: {
            x: cfg.x - 50,
            y: cfg.x - 50,
            fill: '#999',
            text: '我是一个自定义node2',
          },
        })
        return group.addShape('rect', {
          attrs: {
            x: cfg.x - 50,
            y: cfg.y - 50,
            width: cfg.size,
            height: cfg.size,
            stroke: cfg.color,
          },
        })
      },
    })
    G6.registEdge('customEdge', {
      draw: (cfg, group) => {
        group.addShape('text', {
          attrs: {
            x: (cfg.points[0].x + cfg.points[1].x) / 2,
            y: (cfg.points[0].y + cfg.points[1].y) / 2,
            fill: '#333',
            text: '我是一个自定义边（edge）',
            textAlign: 'center',
          },
        })
        return group.addShape('polyline', {
          attrs: {
            points: [
              [ cfg.points[0].x, cfg.points[0].y ],
              [ cfg.points[1].x, cfg.points[1].y ],
            ],
            stroke: cfg.color,
            lineWidth: cfg.size,
          },
        })
      },
    })
    const net = new G6.Net({
      id: 'c1',
      // width: 500,
      height: 500,
      grid: {
        forceAlign: true,
        cell: 10,
      },
    })
    net.source(data.nodes, data.edges)
    net.node().size(100).color('red')
    net.edge()
      .color('blue')
      .size(3)
    net.render()
  }

  render() {
    return (<div id="c1"/>)
  }
}

