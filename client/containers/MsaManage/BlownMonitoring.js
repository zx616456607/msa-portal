import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Card, Icon } from 'antd'
import './style/BlownMonitoring.less'
import { getServiceDetail, getClusterProxies } from '../../actions/msa'

const DEFAULT_SERVICE = 'spring-cloud-hystrix-turbine'

class BlownMonitoring extends React.Component {
  componentDidMount() {
    const { getServiceDetail, currentCluster, getClusterProxies } = this.props
    const { clusterID } = currentCluster
    getServiceDetail(clusterID, DEFAULT_SERVICE)
    getClusterProxies(clusterID)
  }

  render() {
    // const { currentCluster } = this.props
    // const { apiHost } = currentCluster
    // const blownUrl = `http://${apiHost.split(':')[0]}`
    // const iframeSrc = `${blownUrl}:9901/hystrix/monitor?stream=${blownUrl}:9902/trubine.stream`
    const iframeSrc = 'http://192.168.1.230:37037/hystrix/monitor?stream=http://192.168.1.230:11619/trubine.stream'
    const extra = <a target="_blank" href={iframeSrc}>
      <Icon type="export" /> 新页签打开
    </a>
    return (
      <QueueAnim className="blown-monitoring">
        <div className="layout-content-body" key="body">
          <Card extra={extra}>
            <iframe title="blown monitoring" src={iframeSrc} />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, entities } = state
  const currentCluster = entities.clusters[current.config.cluster.id]
  return {
    currentCluster,
  }
}

export default connect(mapStateToProps, {
  getServiceDetail,
  getClusterProxies,
})(BlownMonitoring)
