/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CallLinkTracking container
 *
 * 2018-10-08
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Card, Tabs, Button, Table } from 'antd'
import componentImg from '../../../../assets/img/serviceMesh/component.png'
import './style/index.less'

const TabPane = Tabs.TabPane

class ComponentDetail extends React.Component {
  state = {}

  handleDelete = () => {}

  render() {
    const columns = [{
      id: 'id',
      title: '服务名称',
      width: '15%',
      dataIndex: 'name',
    }, {
      title: '组件服务版本',
      dataIndex: 'servicecount',
    }, {
      title: '路由规则',
      width: '25%',
      dataIndex: '',
    }, {
      title: '操作',
      render: () => <div>
        <Button onClick={() => this.handleDelete()}>删除</Button>
      </div>,
    }]
    return (
      <QueueAnim className="component-detail">
        <div className="component-detail-title layout-content-btns" keys="btn">
          <div className="back">
            <span className="backjia"></span>
            <span className="btn-back" onClick={() =>
              this.props.history.push('/service-mesh/component-management')
            }>返回组件管理列表</span>
          </div>
          <div className="title">组件详情</div>
        </div>
        <Card className="component-detail-top" key="desc">
          <div className="topLeft">
            <div className="imgs">
              <img src={componentImg} />
            </div>
            <div className="desc">
              <h2>实例名称：</h2>
              <div className="descs">
                <div>创建时间：</div>
                <div>描述：</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="component-detail-body">
          <Tabs defaultActiveKey="1">
            <TabPane tab="关联服务" key="1">
              <div>
                <Button icon="plus" type="primary">关联后端服务</Button>
                <Button icon="sync">刷新</Button>
              </div>
              <Table
                pagination={false}
                loading={false}
                dataSource={[]}
                columns={columns}
                rowKey={row => row.id}/>
            </TabPane>
          </Tabs>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
  }
}

export default connect(mapStateToProps, {
})(ComponentDetail)

