/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * instance detail log component
 *
 * 2018-2-1
 * @author zhangcz
 */

import React from 'react'
import { loadInstanceLogs } from '../../../../actions/CSB/instance'
import { connect } from 'react-redux'
import LogTemplate from '../../../../components/Log'
import { Spin } from 'antd'


class Log extends React.Component {
  static propTypes = {}

  componentWillMount() {
    this.loadData()
  }

  loadData = (query = {}) => {
    const { loadInstanceLogs, instance, clusterID } = this.props
    const { namespace } = instance
    query = Object.assign({}, query)
    loadInstanceLogs(clusterID, namespace, query)
  }

  render() {
    const { instanceLogs, instance } = this.props
    const { namespace } = instance
    const logs = instanceLogs[namespace] || { isFetching: true }
    const { isFetching, data } = logs
    if (isFetching) {
      return <div><Spin /></div>
    }
    return <div>
      <LogTemplate loadData={this.loadData} data={data}/>
    </div>
  }
}

const mapStateToProps = state => {
  const { CSB } = state
  const { instanceLogs } = CSB
  return {
    instanceLogs,
  }
}

export default connect(mapStateToProps, {
  loadInstanceLogs,
})(Log)
