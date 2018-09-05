/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * RelationChart.js page
 *
 * @author zhangtao
 * @date Tuesday August 7th 2018
 */
import React from 'react'
import RelationChart from '@tenx-ui/relation-chart'
import NodeDetailModal from './NodeDetailModal'
import cloneDeep from 'lodash/cloneDeep'
import { connect } from 'react-redux'
import * as meshAction from '../../../actions/serviceMesh'

const config = {
  rankdir: 'LR',
  nodesep: 50,
  edgesep: 10,
  ranksep: 150,
  marginx: 30,
  marginy: 30,
} // 默认relation-chart 配置

const formateNodesEdges = onClick => {
  const nodes = [
    { id: 'kspacey', label: 'Kevin Spacey', width: 50, height: 50, onClick },
    { id: 'swilliams', label: 'Saul Williams', width: 50, height: 50, onClick },
    { id: 'bpitt', label: 'Brad Pitt', width: 50, height: 50, onClick },
    { id: 'hford', label: 'Harrison Ford', width: 50, height: 50, onClick },
    { id: 'lwilson', label: 'Luke Wilson', width: 50, height: 50, onClick },
    { id: 'kbacon', label: 'Kevin Bacon', width: 50, height: 50, onClick },
  ]
  const edges = [
    { source: 'kspacey', target: 'swilliams', withArrow: true, arrowOffset: 10, label: 'hello' },
    { source: 'swilliams', target: 'kbacon', withArrow: true, arrowOffset: 10, label: 'hi' },
    { source: 'bpitt', target: 'kbacon', withArrow: true, arrowOffset: 10, label: 'hey' },
    { source: 'hford', target: 'lwilson', withArrow: true, arrowOffset: 10, label: 'yo' },
    { source: 'lwilson', target: 'kbacon', withArrow: true, arrowOffset: 10, label: 'ha' },
    { source: 'kbacon', target: 'lwilson', withArrow: true, arrowOffset: 10, label: 'hehe' },
  ]
  return { nodes, edges }
}

@connect(mapStateToProps, { loadServiceMeshGraph: meshAction.loadServiceMeshGraph })
export default class RelationChartComponent extends React.Component {
  state = {
    visible: false,
    currentService: '',
    nodes: [],
    edges: [],
  }
  componentDidMount() {
    const { nodes, edges } = formateNodesEdges(this.onClick)
    this.setState({ nodes, edges })
  }
  componentWillReceiveProps(nextProps = {}) {
    // 当用户修改任何的检索条件时, 在这里检查搜索条件是否合法并且是否和上次的不一样, 如果同时满足这两个情况,
    // 就向后台重新请求新的拓扑图数据
    // 新的拓扑图数据也应该在这里加工, 并设置到state上用于显示
    // 这样写的好处是, 一旦搜索条件有变化, 就可以自动发送新的请求,
    // 注意! 向后台发送数据有可能改变props, 造成死循环, 要写好处理条件
    const { app, cluster, item, timeRange } = nextProps.searchQuery
    const { app: capp, cluster: ccluster, item: citem, timeRange: ctimeRange,
    } = this.props.searchQuery
    const { begin, end } = timeRange
    const { begin: cbegin, end: cend } = ctimeRange
    const { loadServiceMeshGraph } = this.props
    const check = typeof app === 'string' && typeof cluster === 'string' && typeof item === 'string'
    && typeof timeRange === 'object'
    const diff = app !== capp || cluster !== ccluster || item !== citem || begin !== cbegin ||
    end !== cend
    if (check && diff) {
      loadServiceMeshGraph(cluster, { project: item },
        { service: app, begin: 0, end: 1000 })
    }
  }
  onClick = lname => {
    const { nodes } = this.state
    const newNodes = cloneDeep(nodes)
    newNodes.forEach(n => {
      if (n.active !== undefined) {
        delete n.active
      }
      if (n.id === lname) {
        n.active = true
      }
    })
    this.setState({ currentService: lname, visible: true, nodes: newNodes })
  }
  render() {
    const { visible, currentService, nodes, edges } = this.state
    // console.log('nodes', nodes)
    return (
      <div className="wrap">
        <RelationChart
          graphConfigs={config}
          nodes={nodes}
          edges={edges}
          style={{ height: '500px' }}
        />
        <NodeDetailModal isVisible={visible} onClose={() => this.setState({ visible: false })}
          serviceName={currentService} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { serviceMesh } = state
  const graphDataList = serviceMesh && serviceMesh.graphDataList
  return {
    graphDataList,
  }
}
