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
import confirm from '../../../components/Modal/confirm'

export default class MeshGateway extends React.Component {
  state = {
    addModal: false,
    modalType: 'create',
  }
  onCreateBtnClick = () => this.setState({
    addModal: true,
    modalType: 'create',
  })
  closeAddModal = () => this.setState({
    addModal: false,
  })
  deleteGateway = () => {
    confirm({
      modalTitle: '删除操作',
      title: '确定删除 xxx 网关?',
      content: <div>删除该网关后，已使用此网关的路由策略中的服务将不能通过此网关出口被访问</div>,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // return deleteClient().then(() => {
        //   notification.success({
        //     message: '删除成功',
        //   })
        //   this.loadClientList()
        // }).catch(() => {
        //   notification.warn({
        //     message: '删除失败',
        //   })
        // })
      },
    })
  }
  render() {
    const { addModal, modalType } = this.state
    return (
      <QueueAnim className="mesh-gateway">
        <div className="layout-content-btns" key="btns">
          <Button onClick={this.onCreateBtnClick} icon="plus" type="primary">创建网关</Button>
        </div>
        <div className="content">
          {
            [ 1, 2, 3, 4, 5, 6, 7, 8 ].map(i =>
              <GatewayCard
                key={i}
                onDelete={this.deleteGateway}
              />
            )
          }
        </div>
        <GatewayModal visible={addModal} type={modalType} closeModal={this.closeAddModal}/>
      </QueueAnim>
    )
  }
}
