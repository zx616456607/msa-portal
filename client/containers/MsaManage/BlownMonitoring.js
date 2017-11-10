import React from 'react'
import QueueAnim from 'rc-queue-anim'

export default class BlownMonitoring extends React.Component {
  render() {
    return (
      <QueueAnim>
        <h1 key="1">熔断监控</h1>
        <h1 key="2">熔断监控</h1>
        <h1 key="3">熔断监控</h1>
        <h1 key="4">熔断监控</h1>
      </QueueAnim>
    )
  }
}
