/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * GroupsDeatil of auth zones
 *
 * @author zhaoyb
 * @date 2018-06-07
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Row, Col, Menu, Dropdown, Card, Transfer, Modal } from 'antd'
import classNames from 'classnames'
import './style/groupsDetail.less'
import QueueAnim from 'rc-queue-anim'
import groupsIcon from '../../../../../../assets/img/msa-manage/groups.png'
import { getGroupDetail } from '../../../../../../actions/certification'
import { formatDate } from '../../../../../../common/utils'

const Search = Input.Search
class GroupsDetail extends React.Component {
  state = {
    inputValue: '',
  }

  componentDidMount() {
    this.loadGroupDetailList()
  }

  loadGroupDetailList = () => {
    const { getGroupDetail, groupInfo } = this.props
    const query = {
      returnEntities: true,
    }
    getGroupDetail(groupInfo.id, query)

  }

  handlDeleteUser = () => {

  }

  handlEditGroup = () => {

  }

  render() {
    const { groupInfo, DataAry, isFetching } = this.props
    const menu = (
      <Menu style={{ width: 90 }} onClick={e => this.handleMenu(e)}>
        <Menu.Item key="groupName">管理组用户</Menu.Item>
      </Menu>
    )
    const pagination = {
      simple: true,
      total: DataAry ? DataAry.length : 0,
      pageSize: 10,
    }
    const columns = [
      {
        id: 'entity.id',
        title: '用户名',
        key: 'entity.userName',
        dataIndex: 'entity.userName',
      },
      {
        title: '授权范围',
        dataIndex: 'approvals',
        key: 'approvals',
        width: '10%',
      },
      {
        title: '用户来源',
        dataIndex: 'entity.origin',
        key: 'entity.origin',
        width: '15%',
      },
      {
        title: '操作',
        width: '15%',
        render: record => {
          return (
            <Button onClick={this.handlDeleteUser(record)}>移除用户</Button>
          )
        },
      },
    ]

    return (
      <QueueAnim className="groups-detail">
        <div className="groups-detail-header ant-row" key="title">
          <div className="groups-detail-header-icon">
            <img width="80" height="80" src={groupsIcon} alt="groups" />
          </div>
          <div className="groups-detail-header-right">
            <div>
              <h2 className="txt-of-ellipsis">
                组：{groupInfo.id}
              </h2>
            </div>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  组名：{groupInfo.displayName}
                </div>
              </Col>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  所属服务组：--
                </div>
              </Col>
              <Col span={12} className="groups-detail-header-btns">
                <Dropdown.Button overlay={menu} onClick={() => this.handlEditGroup()}>
                  编辑
                </Dropdown.Button>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  创建时间：{formatDate(groupInfo.meta.created)}
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                  组授权范围：--
                </div>
              </Col>
            </Row>
            <Row className="desc">
              <div className="txt-of-ellipsis">
                描述：{groupInfo.description || '--'}
              </div>
            </Row>
          </div>
        </div>
        <div className="groups-detail-body" key="body">
          <Card>
            <div className="title">
              <span>组用户</span>
            </div>
            <div className="layout-content-btns">
              <Button icon="reload" type="primary" onClick={this.loadGroupDetailList}>刷新</Button>
              <Search
                placeholder="请输入客户端ID搜索"
                style={{ width: 200 }}
                onChange={e => this.setState({ inputValue: e.target.value })}
                onSearch={this.loadGroupDetailList}
              />
              <div className={classNames('page-box', { hide: !DataAry.length })}>
                <span className="total">共 0 条</span>
              </div>
            </div>
            <div className="layout-content-body">
              <Table
                columns={columns}
                loading={isFetching}
                dataSource={DataAry}
                pagination={pagination}
                rowKey={key => key.id} />
            </div>
          </Card>
        </div>
        <Modal
          title="管理组用户"
          visible={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Transfer
            dataSource={this.state.mockData}
            showSearch
            listStyle={{ width: 250, height: 300 }}
            operations={[ '移除', '添加' ]}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => `${item.title}-${item.description}`}
            footer={this.renderFooter}
          />
        </Modal>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneGroupsDetail } = certification
  const { data, isFetching } = zoneGroupsDetail
  const DataAry = []
  if (data) {
    DataAry.push(data[0])
  }
  return {
    DataAry,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  getGroupDetail,
})(GroupsDetail)

