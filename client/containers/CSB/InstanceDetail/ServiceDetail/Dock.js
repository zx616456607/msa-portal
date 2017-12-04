import React from 'react'
import Dock from '../../../../components/Dock'
import ServiceDetail from './'

export default class ServiceDetailDock extends React.Component {
  render() {
    const { visible, onVisibleChange } = this.props
    return (
      <Dock
        position="right"
        defaultSize={0.65}
        minSize={0.45}
        isResizing={false}
        isVisible={visible}
        dimMode="opaque"
        onVisibleChange={onVisibleChange}
        dockStyle={{
          cursor: 'initial',
        }}
      >
        <ServiceDetail />
      </Dock>
    )
  }
}
