import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Card, Button } from 'antd'
import './style/BlownMonitoring.less'

export default class BlownMonitoring extends React.Component {
  render() {
    const iframeSrc = 'http://192.168.1.249:9901/hystrix/monitor?stream=http://192.168.1.249:9902/trubine.stream'
    return (
      <QueueAnim className="blown-monitoring">
        <div className="router-manage-btn-box layout-content-btns" key="btns">
          <Button onClick={() => window.open(iframeSrc)} type="dashed" icon="export">
          新页签打开
          </Button>
        </div>
        <div className="layout-content-body" key="body">
          <Card noHovering>
            <iframe src={iframeSrc} />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}
