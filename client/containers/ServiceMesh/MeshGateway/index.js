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
import { Button, Input, notification, Spin, Pagination } from 'antd'
import GatewayCard from './Card'
import GatewayModal from './GatewayModal'
import '@tenx-ui/modal/assets/index.css'
import * as modal from '@tenx-ui/modal'
import * as actions from '../../../actions/meshGateway'
import { connect } from 'react-redux'
import emptyImg from '../../../assets/img/serviceMesh/gatewayEmpty.png'

const Search = Input.Search
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
    gatewayName: '',
    searchName: '',
    currentPage: 1,
    size: 5,
  }
  componentDidMount() {
    this.fetchGateway()
  }
  fetchGateway = () => {
    const { getMeshGateway, getMeshIngressGateway, clusterID } = this.props
    getMeshGateway && getMeshGateway(clusterID)
    getMeshIngressGateway && getMeshIngressGateway(clusterID)
  }
  onSearch = () => {
    this.setState({
      searchName: this.state.gatewayName,
      currentPage: 1,
    })
  }
  onRefresh = () => {
    this.setState({
      gatewayName: '',
      searchName: '',
      currentPage: 1,
    })
    this.fetchGateway()
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
    modal.confirm({
      modalTitle: '删除操作',
      title: `确定删除 ${id} 网关?`,
      content: <div>删除该网关后，已使用此网关的路由策略中的服务将不能通过此网关出口被访问</div>,
      okText: '确定',
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
  renderCard = (listData, gatewayData, ingressData) => {
    const { currentPage, size } = this.state
    return listData.map((id, index) => {
      if (index >= (currentPage - 1) * size && index < currentPage * size) {
        return <GatewayCard
          key={gatewayData[id].metadata.name}
          onDelete={this.deleteGateway}
          onEdit={this.editGateway}
          showDetail={this.showDetail}
          data={gatewayData[id]}
          ingressData={ingressData}
          id={id}
        />
      }
      return null
    })
  }
  render() {
    const {
      addModal, modalType, modalData, searchName, size, currentPage, gatewayName,
    } = this.state
    const {
      meshGatewayList,
      entities: { meshGatewayList: gatewayData, meshIngressGatewayList: ingressData },
    } = this.props
    const listData = (meshGatewayList.data || []).filter(gate =>
      gate.indexOf(searchName) > -1
    )
    const paginationProps = {
      simple: true,
      total: listData.length || 0,
      pageSize: size,
      current: currentPage,
      onChange: page => this.setState({ currentPage: page }),
    }
    return (
      <QueueAnim className="mesh-gateway">
        <div className="layout-content-btns" key="btns">
          <Button onClick={this.onCreateBtnClick} icon="plus" type="primary">创建网关</Button>
          <Button onClick={this.onRefresh} icon="sync">刷新</Button>
          <Search
            placeholder="请输入网关名称搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ gatewayName: e.target.value })}
            onSearch={this.onSearch}
            value={gatewayName}
          />
          <div className="page-box mesh-page">
            <span className="total">共 {listData.length || 0} 条</span>
            <Pagination {...paginationProps}/>
          </div>
        </div>
        <Spin spinning={meshGatewayList.isFetching} key="content">
          <div className="content">
            {
              listData.length ? this.renderCard(listData, gatewayData, ingressData) : <div className={'noneIcon'}>
                <img className={'gateway'} src={emptyImg}/>
                <div>暂无网关</div>
              </div>
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
