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
import { Button, notification, Spin } from 'antd'
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
  deleteMeshGateway: actions.deleteMeshGateway,
  getMeshIngressGateway: actions.getMeshIngressGateway,
})
export default class MeshGateway extends React.Component {
  state = {
    addModal: false,
    modalType: 'create',
    modalData: {},
  }
  componentDidMount() {
    const { getMeshGateway, getMeshIngressGateway, clusterID } = this.props
    getMeshGateway && getMeshGateway(clusterID)
    getMeshIngressGateway && getMeshIngressGateway(clusterID)
  }
  onCreateBtnClick = () => this.setState({
    addModal: true,
    modalType: 'create',
  })
  closeAddModal = () => this.setState({
    addModal: false,
    modalData: {},
  })
  deleteGateway = id => {
    const { deleteMeshGateway, clusterID, getMeshGateway } = this.props
    confirm({
      modalTitle: '删除操作',
      title: `确定删除 ${id} 网关?`,
      content: <div>删除该网关后，已使用此网关的路由策略中的服务将不能通过此网关出口被访问</div>,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return new Promise((resolve, reject) => {
          deleteMeshGateway(clusterID, id).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: `删除网关 ${id} 成功`,
            })
            getMeshGateway(clusterID)
          })
        })
      },
    })
  }
  showDetail = data => {
    this.setState({
      modalType: 'detail',
      modalData: data,
      addModal: true,
    })
  }
  editGateway = data => {
    this.setState({
      modalType: 'edit',
      modalData: data,
      addModal: true,
    })
  }
  render() {
    const { addModal, modalType, modalData } = this.state
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
                  onEdit={this.editGateway}
                  showDetail={this.showDetail}
                  data={gatewayData[id]}
                  ingressData={ingressData}
                  id={id}
                />
              )
            }
          </div>
        </Spin>
        {
          addModal &&
          <GatewayModal
            visible={addModal}
            data={modalData}
            type={modalType}
            closeModal={this.closeAddModal}
          />
        }
      </QueueAnim>
    )
  }
}
