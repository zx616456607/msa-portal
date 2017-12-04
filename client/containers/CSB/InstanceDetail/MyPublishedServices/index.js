import React from 'react'
import ServiceDetailDock from '../ServiceDetail/Dock'

export default class MyPublishedServices extends React.Component {
  state = {
    visible: false,
  }

  render() {
    return (
      <div>
        <h1>我发布的服务</h1>
        <a onClick={() => this.setState({ visible: true })}>服务1</a>
        {
          this.state.visible &&
          <ServiceDetailDock
            visible={true}
            onVisibleChange={visible => this.setState({ visible })}
          />
        }
      </div>
    )
  }
}
