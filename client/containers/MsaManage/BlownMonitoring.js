import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Card, Icon } from 'antd'
import './style/BlownMonitoring.less'

class BlownMonitoring extends React.Component {
  render() {
    const { currentCluster } = this.props
    const { apiHost } = currentCluster
    const blownUrl = `http://${apiHost.split(':')[0]}`
    const iframeSrc = `${blownUrl}:9901/hystrix/monitor?stream=${blownUrl}:9902/trubine.stream`
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
  //
})(BlownMonitoring)
