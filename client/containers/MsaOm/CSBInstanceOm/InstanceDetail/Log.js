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


class Log extends React.Component {
  static propTypes = {}

  loadData = (query = {}) => {
    const { loadInstanceLogs, instacneID, clusterID } = this.props
    query = Object.assign({}, query)
    loadInstanceLogs(clusterID, instacneID, query).then(res => {
      console.log('res=', res)
    })
  }

  render() {
    return <div>
      <LogTemplate loadData={this.loadData}/>
    </div>
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  loadInstanceLogs,
})(Log)
