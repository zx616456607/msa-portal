/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CreateG6 component
 *
 * 2018-07-06
 * @author zhaoyb
 */

import G6 from '@antv/g6'
import React from 'react'
import isEqual from 'lodash/isEqual'

// 关闭 G6 的体验改进计划打点请求
G6.track(false)
let uniqueId = 0

function generateUniqueId() {
  return `rc-g6-${uniqueId++}`
}

export default function createG6Flow(__operation) {
  class Component extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.net = null
      this.graphId = generateUniqueId()
    }

    componentWillUnmount() {
      // this.net.destroy()
      this.net = null
      this.graphId = null
    }

    componentDidMount() {
      this.initGraph(this.props)
    }

    componentWillReceiveProps(newProps) {
      const { data } = newProps
      if (!isEqual(data) && data.nodes.length > 0) {
        let nodes = data.nodes
        const edges = data.edges
        const layout = new G6.Layout.Flow({
          nodes,
          edges,
        })
        nodes = layout.getNodes()
        nodes.forEach(node => {
          const x = node.x * 500 - 2 * 60 + 60
          const y = node.y * 800 - 2 * 60 + 60
          node.x = y
          node.y = x
        })
        this.net.changeData(nodes, edges)
      }
    }

    shouldComponentUpdate() {
      return false
    }

    initGraph(props) {
      const { data } = props
      G6.registNode('rect', {
        // 设置锚点
        getAnchorPoints() {
          return [
            [ 1, 0.5 ],
            [ 0, 0.5 ],
          ]
        },
      })
      // 第三步：进行布局
      // const Layout = G6.Layout;
      const margin = 60
      const height = 800 - 2 * margin;
      const width = 500 - 2 * margin;
      let nodes = data.nodes
      const edges = data.edges
      if (nodes.length > 0) {
        const layout = new G6.Layout.Flow({
          nodes,
          edges,
        })
        nodes = layout.getNodes()
        nodes.forEach(node => {
          const x = node.x * width + margin
          const y = node.y * height + margin
          node.x = y
          node.y = x
        })
      }

      // 第四步：初始化图
      const net = new G6.Net({
        id: this.graphId,
        height: 650,
        fitView: 'autoZoom',
      })
      net.edge()
        .shape('rect')
        .style(function(obj) {
          if (obj.errPart === true) {
            return {
              arrow: true,
              lineDash: [ 5, 5 ],
            }
          }
          return {
            arrow: true,
          }
        })
        .size(2)
      // 第五步：载入数据
      net.source(nodes, edges)
      __operation(net)
      this.net = net
    }
    render() {
      return (<div id={this.graphId} />)
    }
  }
  return Component
}

