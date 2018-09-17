/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
*/

/**
 *
 *  mesh gateway
 *
 * @author Songsz
 * @date 2018-09-12
 *
*/

import React from 'react'
import './style/index.less'
import QueueAnim from 'rc-queue-anim'
import { Button } from 'antd'
import GatewayCard from './Card'
import GatewayModal from './GatewayModal'

export default class MeshGateway extends React.Component {
  state = {
    modal: false,
    modalType: 'create',
  }
  onCreateBtnClick = () => this.setState({
    modal: true,
    modalType: 'create',
  })
  closeModal = () => this.setState({
    modal: false,
  })
  render() {
    const { modal, modalType } = this.state
    return (
      <QueueAnim className="mesh-gateway">
        <div className="layout-content-btns" key="btns">
          <Button onClick={this.onCreateBtnClick} icon="plus" type="primary">创建网关</Button>
        </div>
        <div className="content">
          {
            [ 1, 2, 3, 4, 5, 6, 7, 8 ].map(i => <GatewayCard key={i}/>)
          }
        </div>
        <GatewayModal visible={modal} type={modalType} closeModal={this.closeModal}/>
      </QueueAnim>
    )
  }
}
