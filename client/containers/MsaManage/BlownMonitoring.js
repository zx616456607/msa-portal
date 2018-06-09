import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Card, Icon, Spin } from 'antd'
import './style/BlownMonitoring.less'
import { getServiceDetail, getClusterProxies } from '../../actions/msa'

const DEFAULT_SERVICE = 'spring-cloud-hystrix-turbine'
const TENXCLOUD_SCHEMA_PORT_NAME = 'tenxcloud.com/schemaPortname'

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
    const { serviceDetail, serviceProxy } = this.props
    const {
      isFetching: detailFetching, data: detailData,
    } = serviceDetail || { isFetching: true, data: {} }
    const {
      isFetching: proxyFetching,
      data: proxyData,
    } = serviceProxy || { isFetching: true, data: [] }
    if (detailFetching || proxyFetching) {
      return <Spin/>
    }
    const { service } = detailData[DEFAULT_SERVICE]
    const portName = service.metadata.annotations[TENXCLOUD_SCHEMA_PORT_NAME]
    const portArr = portName.split(',')
    const [ port1, port2 ] = [ portArr[0].split('/').pop(), portArr[1].split('/').pop() ]
    const { address } = proxyData[0]
    const iframeSrc =
      `http://${address}:${port1}/hystrix/monitor?stream=http://${address}:${port2}/trubine.stream`
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
  const { current, entities, msa } = state
  const currentCluster = entities.clusters[current.config.cluster.id]
  const { serviceDetail, serviceProxy } = msa
  return {
    currentCluster,
    serviceDetail,
    serviceProxy,
  }
}

export default connect(mapStateToProps, {
  getServiceDetail,
  getClusterProxies,
})(BlownMonitoring)
