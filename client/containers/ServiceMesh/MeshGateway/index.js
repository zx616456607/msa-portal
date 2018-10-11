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
import { Button, Spin } from 'antd'
import GatewayCard from './Card'
import GatewayModal from './GatewayModal'
import confirm from '../../../components/Modal/confirm'
import * as actions from '../../../actions/meshGateway'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  const { current, meshGateway: { meshGatewayList }, entities } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
    meshGatewayList,
    entities,
  }
}

@connect(mapStateToProps, {
  getMeshGateway: actions.getMeshGateway,
})
export default class MeshGateway extends React.Component {
  state = {
    addModal: false,
    modalType: 'create',
  }
  componentDidMount() {
    const { getMeshGateway, clusterID } = this.props
    getMeshGateway && getMeshGateway(clusterID)
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
    const {
      meshGatewayList,
      entities: { meshGatewayList: gatewayData, meshIngressGatewayList: ingressData },
    } = this.props
    return (
      <QueueAnim className="mesh-gateway">
        <div className="layout-content-btns" key="btns">
          <Button onClick={this.onCreateBtnClick} icon="plus" type="primary">创建网关</Button>
        </div>
        <Spin spinning={meshGatewayList.isFetching} key="content">
          <div className="content">
            {
              (meshGatewayList.data || []).map(id =>
                <GatewayCard
                  key={gatewayData[id].metadata.name}
                  onDelete={this.deleteGateway}
                  data={gatewayData[id]}
                  ingressData={ingressData}
                  id={id}
                />
              )
            }
          </div>
        </Spin>
        <GatewayModal visible={addModal} type={modalType} closeModal={this.closeAddModal}/>
      </QueueAnim>
    )
  }
}
