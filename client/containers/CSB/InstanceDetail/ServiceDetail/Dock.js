import React from 'react'
import Dock from '../../../../components/Dock'
import ServiceDetail from './'

export default class ServiceDetailDock extends React.Component {
  render() {
    const { visible } = this.props
    return (
      <Dock
        position="right"
        isVisible={visible}
        dimMode="opaque"
        dimStyle={{ backgroundColor: 'transparent' }}
        onVisibleChange={this.props.onCancel}
      >
        <ServiceDetail />
      </Dock>
    )
  }
}
