/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CreateG6 component
 *
 * 2017-08-23
 * @author zhangxuan
 */

import G6 from '@antv/g6'
import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
let uniqueId = 0

function generateUniqueId() {
  return `rc-g6-${uniqueId++}`
}

export default function createG6(__operation) {
  class Component extends React.Component {
    static propTypes = {
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.object,
      ]).isRequired,
      width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      height: PropTypes.number.isRequired,
      plotCfg: PropTypes.object,
      forceFit: PropTypes.bool,
      configs: PropTypes.object,
    }
    constructor(props, context) {
      super(props, context)
      this.net = null
      this.graphId = generateUniqueId()
    }

    componentDidMount() {
      this.initGraph(this.props)
    }

    componentWillReceiveProps(newProps) {
      const { width: newWidth, height: newHeight, data: newData } = newProps
      const { width: oldWidth, height: oldHeight, data: oldData } = this.props

      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        this.net.changeSize(newWidth, newHeight)
      }
      if (!isEqual(newData, oldData)) {
        const nodes = newData.nodes
        const edges = newData.edges
        this.net.changeData(nodes, edges)
      }
    }

    shouldComponentUpdate() {
      return false
    }

    componentWillUnmount() {
      this.net.destroy()
      this.net = null
      this.graphId = null
    }

    initGraph(props) {
      const { width, height, data } = props
      const margin = 10
      const height1 = 600 - 2 * margin
      const width1 = 500 - 2 * margin
      let nodes = data.nodes
      const edges = data.edges
      const layout = new G6.Layout.Flow({
        nodes,
        edges,
      })
      nodes = layout.getNodes()
      nodes.forEach(node => {
        const x = node.x * width1 + margin
        const y = node.y * height1 + margin
        node.x = x
        node.y = y
      })
      const net = new G6.Net({
        id: this.graphId,
        fitView: 'cc',
        width,
        height,
      })
      net.edge()
        .shape('smooth')
        .style({
          arrow: true,
        })
        .size(2)
      net.source(nodes, edges)
      __operation(net)
      this.net = net
    }
    render() {
      return (<div id={this.graphId}/>)
    }
  }
  return Component
}
