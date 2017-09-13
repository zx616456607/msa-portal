/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Config
 *
 * 2017-09-13
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './style/configCenter.less'
import { Row, Tabs, Button, Icon, Table, Pagination } from 'antd'
const TabPane = Tabs.TabPane

class ConfigCenter extends React.Component {
  handleChang = () => {
  }
  render() {
    const columns = [{
      title: '配置名称',
      dataIndex: 'name',
      render: text =>
        <Link to={`/msa-manage/config-center/${text}#detal=true`}>
          {text}
        </Link>,
    }, {
      title: '更新时间',
      dataIndex: 'time',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: () => <div>
        <span style={{ color: '#2db7f5', cursor: 'pointer' }}>查看详情</span>&nbsp; | &nbsp;
        <span style={{ color: '#f85a5a', cursor: 'pointer' }}>删除</span>
      </div>,
    }]

    const data = [{
      key: '1',
      name: 'config-1',
      time: '1分钟',
    }, {
      key: '2',
      name: 'config-2',
      time: '5分钟',
    }]

    return (
      <Row className="layout-content-btns">
        <Tabs onChange={this.handleChang} type="card">
          <TabPane tab="开发环境 （2）" key="1">
            <div className="exploit">
              <div className="headers">
                <Button className="add" type="primary" onClick={() => this.props.history.push('/msa-manage/config-center/config/create')}>
                  <Icon type="plus" style={{ color: '#fff' }} />
                  <span className="font">添加配置</span>
                </Button>
                <div className="pages">
                  <span className="total">共计2条</span>
                  <Pagination simple defaultCurrent={0} total={2} />
                </div>
              </div>
              <div className="bottom">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="测试环境 （1）" key="2">
            <div className="exploit">
              <div className="headers">
                <Button className="add" type="primary">
                  <Icon type="plus" style={{ color: '#fff' }} />
                  <span className="font">添加配置</span>
                </Button>
                <div className="pages">
                  <span className="total">共计2条</span>
                  <Pagination simple defaultCurrent={0} total={2} />
                </div>
              </div>
              <div className="bottom">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="生成环境 （1）" key="3">
            <div className="exploit">
              <div className="headers">
                <Button className="add" type="primary">
                  <Icon type="plus" style={{ color: '#fff' }} />
                  <span className="font">添加配置</span>
                </Button>
                <div className="pages">
                  <span className="total">共计2条</span>
                  <Pagination simple defaultCurrent={0} total={2} />
                </div>
              </div>
              <div className="bottom">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false} />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return { state }
}

export default connect(mapStateToProps, {
})(ConfigCenter)
