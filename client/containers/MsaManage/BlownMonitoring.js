import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Card, Icon } from 'antd'
import './style/BlownMonitoring.less'

export default class BlownMonitoring extends React.Component {
  render() {
    const iframeSrc = 'http://192.168.1.249:9901/hystrix/monitor?stream=http://192.168.1.249:9902/trubine.stream'
    const extra = <a target="_blank" href={iframeSrc}>
      <Icon type="export" /> 新页签打开
    </a>
    return (
      <QueueAnim className="blown-monitoring">
        <div className="layout-content-body" key="body">
          <Card noHovering extra={extra}>
            <iframe src={iframeSrc} />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}
