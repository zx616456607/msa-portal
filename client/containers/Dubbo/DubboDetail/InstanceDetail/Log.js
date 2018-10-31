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
import { loadDubboInstanceLogs } from '../../../../actions/dubbo'
import { connect } from 'react-redux'
import LogTemplate from '../../../../components/Log'
import { formatDate } from '../../../../common/utils';

class Log extends React.Component {
  static propTypes = {}

  componentDidMount() {
    const query = {
      date_start: formatDate(new Date(), 'YYYY-MM-DD'),
      date_end: formatDate(new Date(), 'YYYY-MM-DD'),
    }

    this.loadData(query)
  }

  loadData = query => {
    const { loadDubboInstanceLogs, instance, namespace, clusterID } = this.props
    loadDubboInstanceLogs(clusterID, namespace, instance.serviceName, query)
  }

  render() {
    const { dubboInstanceLogs, instance } = this.props
    const logsData = dubboInstanceLogs[instance.serviceName] || { isFetching: true }
    const { isFetching, data = { logs: [] } } = logsData
    return <div>
      <LogTemplate loadData={this.loadData} data={data.logs} isFetching={isFetching}/>
    </div>
  }
}

const mapStateToProps = state => {
  const { dubbo } = state
  const { dubboInstanceLogs } = dubbo
  const { namespace } = state.current.config.project
  return {
    namespace,
    dubboInstanceLogs,
  }
}

export default connect(mapStateToProps, {
  loadDubboInstanceLogs,
})(Log)
