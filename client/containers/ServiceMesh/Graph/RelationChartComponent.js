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
import { findDOMNode } from 'react-dom';
import serviceImg from '../../../assets/img/serviceMesh/serviceMesh.jpg'
// import { Icon } from 'antd'
import './styles/RelationChartComponent.less' // 默认relation-chart 配置
// const TenxNodeFactory = (icon, name, v) => () => <div className="TenxNode" >
//   <Icon type={icon} theme="outlined" />
//   <div>{name}</div>
//   <div>{v}</div>
// </div>
const config = {
  rankdir: 'LR',
  nodesep: 50,
  edgesep: 10,
  ranksep: 150,
  marginx: 30,
  marginy: 30,
}

const ServiceMeshNode = () => {
  return (
    <div className="TenxNode">
      <img
        className="nodeImg"
        src={serviceImg} alt=""/>
    </div>)
}

// 根据后端数据结构获取http各种状态码回来的综合
function formateNumber(message, code) {
  return message.map(item => { return item[code] || 0 })
    .reduce((total, current) => total + parseInt(current), 0)
}
@connect(mapStateToProps, { loadServiceMeshGraph: meshAction.loadServiceMeshGraph })
export default class RelationChartComponent extends React.Component {
  state = {
    visible: false,
    currentService: '',
    nodes: [],
    edges: [],
    fullScreenMode: false, // 默认不是全屏
  }
  componentDidMount() {
  }
  async componentWillReceiveProps(nextProps = {}) {
    // 当用户修改任何的检索条件时, 在这里检查搜索条件是否合法并且是否和上次的不一样, 如果同时满足这两个情况,
    // 就向后台重新请求新的拓扑图数据
    // 新的拓扑图数据也应该在这里加工, 并设置到state上用于显示
    // 这样写的好处是, 一旦搜索条件有变化, 就可以自动发送新的请求,
    // 注意! 向后台发送数据有可能改变props, 造成死循环, 要写好处理条件
    const { app, cluster, item, timeRange = {} } = nextProps.searchQuery
    const { app: capp, cluster: ccluster, item: citem, timeRange: ctimeRange = {},
    } = this.props.searchQuery
    const { begin, end } = timeRange || {}
    const { begin: cbegin, end: cend } = ctimeRange || {}
    const { loadServiceMeshGraph } = this.props
    const check = typeof app === 'string' && typeof cluster === 'string' && typeof item === 'string'
    && typeof timeRange === 'object'
    const diff = app !== capp || cluster !== ccluster || item !== citem || begin !== cbegin
    || end !== cend
    if (check && diff) {
      this.props.setLoading(true)
      await loadServiceMeshGraph(cluster, item,
        { service: app, begin, end })
      this.props.setLoading(false)
    }
    const { data: { nodes = [], edges = [] } = {} } = this.props.graphDataList
    const [ newNodes, newEdges ] = this.formateData(nodes, edges)
    await this.setState({ nodes: newNodes, edges: newEdges })
  }
  formateData = (nodes, edges) => {
    const newNodes = nodes.map(node => {
      const onClick = this.onClick
      return {
        id: node.id,
        label: <span className="nodeLabel">{node.name}</span>,
        version: node.version,
        namespace: node.namespace,
        protocol: node.protocol,
        width: 50,
        height: 50,
        shape: 'circle',
        onClick,
        isAnimated: true,
        TenxNode: ServiceMeshNode,
      }
    })
    const newEdges = edges.map((edge = {}) => {
      const { detail = {} } = edge
      const totalDenominator = Object.values(detail)
        .reduce((total, current) => parseInt(current) + total, 0)
      const totalMember = detail['200'] || 0
      const lineLabel = `/${totalDenominator} calls | ${parseFloat(edge.latency).toFixed(3) || 0}s`
      const lineLabelNode = <div title={lineLabel} className="lineLabel">
        <span className="red">{totalMember}</span>
        {lineLabel}
      </div>
      return {
        source: edge.from,
        target: edge.to,
        withArrow: true,
        arrowOffset: 10,
        label: lineLabelNode,
        isAnimated: true,
        detail: edge.detail,
        color: '#5cb85c',
      }
    })
    return [ newNodes, newEdges ]
  }
  onClick = (lname, e) => {
    e.stopPropagation();
    const { nodes, edges = [] } = this.state
    const newNodes = cloneDeep(nodes)
    newNodes.forEach(n => {
      if (n.active !== undefined) {
        delete n.active
      }
      if (n.id === lname) {
        n.active = true
      }
    })
    const message = edges.filter(({ target }) => target === lname).map(({ detail }) => detail)
    const messageTotal = message.map(item => {
      return Object.values(item).reduce((total, current) => total + parseInt(current), 0)
    }).reduce((total, current) => total + current, 0)
    const choiceNodes = newNodes.filter(({ active }) => active)
    const outMessage = edges.filter(({ source }) => source === lname).map(({ detail }) => detail)
    const outMessageTotal = outMessage.map(item => {
      return Object.values(item).reduce((total, current) => total + parseInt(current), 0)
    }).reduce((total, current) => total + current, 0)
    const currentService = {
      inDetail: {
        total: messageTotal,
        200: formateNumber(message, '200'),
        300: formateNumber(message, '300'),
        400: formateNumber(message, '400'),
        500: formateNumber(message, '500'),
      },
      outDetail: {
        total: outMessageTotal,
        200: formateNumber(outMessage, '200'),
        300: formateNumber(outMessage, '300'),
        400: formateNumber(outMessage, '400'),
        500: formateNumber(outMessage, '500'),
      },
      name: choiceNodes[0].label,
      version: choiceNodes[0].version,
      namespace: choiceNodes[0].namespace,
      protocol: choiceNodes[0].protocol,
    }
    this.setState({ currentService, visible: true, nodes: newNodes })
  }
  onRelationChartClick = () => {
    const { nodes } = this.state;
    const newNodes = [ ...nodes ];
    newNodes.forEach(n => {
      if (n.active !== undefined) {
        delete n.active;
      }
    })
    this.setState({ nodes: newNodes, visible: false })
  }
  fullScreenMode = fullScreenMode => {
    this.setState({ fullScreenMode })
  }
  render() {
    const { visible, currentService, nodes, edges } = this.state
    const { loading } = this.props
    return (
      <div className="RelationChartWrap">
        <RelationChart
          graphConfigs={config}
          nodes={nodes}
          edges={edges}
          SvgHeight = { '65vh' }
          onSvgClick = {this.onRelationChartClick}
          ref = {r => { this.relationChart = r }}
          loading={loading}
          fullScreenMode={this.fullScreenMode}
          activeArrowOffset={14}
        />
        {/* 这里要放两个相同的输入的框的原因是, 全屏和非全屏模式下, modal需要渲染在不同的节点下面, 如果
         modal虽然可以指定渲染节点,但是是一次性的, 所以必须u指定两个, 一个全屏模式下使用, 一个非全屏模式下使用,  */}
        <NodeDetailModal isVisible={this.state.fullScreenMode && visible}
          onClose={() => this.setState({ visible: false })}
          serviceName={currentService} getContainer={findDOMNode(this.relationChart)}
        />
        <NodeDetailModal isVisible={!this.state.fullScreenMode && visible}
          onClose={() => this.setState({ visible: false })}
          serviceName={currentService} getContainer={findDOMNode(document.body)}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { serviceMesh: { graphDataList } = {} } = state
  return {
    graphDataList,
  }
}
