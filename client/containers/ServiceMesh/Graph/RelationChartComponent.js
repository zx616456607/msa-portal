/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * RelationChart.js page
 *
 * @author zhangtao
 * @date Tuesday August 7th 2018
 */
import React from 'react';
import RelationChart from '@tenx-ui/relation-chart';
import NodeDetailModal from './NodeDetailModal'
import cloneDeep from 'lodash/cloneDeep'

const config = {
  rankdir: 'LR',
  nodesep: 50,
  edgesep: 10,
  ranksep: 150,
  marginx: 30,
  marginy: 30,
}; // 默认relation-chart 配置

const formateNodesEdges = onClick => {
  const nodes = [
    { id: 'kspacey', label: 'Kevin Spacey', width: 50, height: 50, onClick },
    { id: 'swilliams', label: 'Saul Williams', width: 50, height: 50, onClick },
    { id: 'bpitt', label: 'Brad Pitt', width: 50, height: 50, onClick },
    { id: 'hford', label: 'Harrison Ford', width: 50, height: 50, onClick },
    { id: 'lwilson', label: 'Luke Wilson', width: 50, height: 50, onClick },
    { id: 'kbacon', label: 'Kevin Bacon', width: 50, height: 50, onClick },
  ];
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

export default class RelationChartComponent extends React.Component {
  state = {
    visible: false,
    currentService: '',
    nodes: [],
    edges: [],
  }
  componentDidMount = () => {
    const { nodes, edges } = formateNodesEdges(this.onClick);
    this.setState({ nodes, edges })
  }
  onClick = lname => {
    const { nodes } = this.state;
    const newNodes = cloneDeep(nodes)
    newNodes.forEach(n => {
      if (n.active !== undefined) {
        delete n.active;
      }
      if (n.id === lname) {
        n.active = true;
      }
    })
    this.setState({ currentService: lname, visible: true, nodes: newNodes })
  }
  render() {
    const { visible, currentService, nodes, edges } = this.state
    // console.log('nodes', nodes)
    return (
      <div style={{ border: '1px solid red' }} className="wrap">
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
