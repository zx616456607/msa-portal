/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetailConfig
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { Row, Col, Select, Button, Icon, Table } from 'antd'
import { connect } from 'react-redux'
import {
  getMsaEnv,
} from '../../../../../actions/msa'
import './style/index.less'

const Option = Select.Option

class MsaDetailConfig extends React.Component {
  handleChange = value => {
    console.log(value)
  }

  loadMsaConfig = () => {
    // const { getMsaEnv, clusterID, name } = this.props
    // getMsaEnv(clusterID, name)
  }

  componentDidMount() {
    this.loadMsaConfig()
  }

  render() {
    const columns = [{
      title: '配置名称',
      dataIndex: 'name',
    }, {
      title: '更新时间',
      dataIndex: 'time',
    }, {
      title: '操作',
      render: () => <a href="#">查看</a>,
    }]
    const data = [{
      key: '1',
      name: 'config.client.properties',
      time: '19天前',
    }, {
      key: '2',
      name: 'config.client.properties',
      time: '12小时前',
    }, {
      key: '3',
      name: 'config.client.properties',
      time: '10小时前',
    }, {
      key: '4',
      name: 'config.client.properties',
      time: '6小时前',
    }, {
      key: '5',
      name: 'config.client.properties',
      time: '5小时前',
    }]
    return (
      <div className="msaDetailConfig">
        <Row type="flex" align="middle">
          <Col span={2}>
            版本分支
          </Col>
          <Col span={22}>
            <Select defaultValue="project-1" style={{ width: 320 }} onChange={this.handleChange}>
              <Option value="project-1">project-1</Option>
              <Option value="project-2">project-2</Option>
              <Option value="project-3">project-3</Option>
              <Option value="project-4">project-4</Option>
            </Select>
          </Col>
        </Row>
        <Button type="primary" className="msaDetailConfig-refresh"><Icon type="sync"/>刷新</Button>
        <Table
          className="msaDetailConfig-table"
          pagination={false}
          columns={columns}
          dataSource={data} />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  getMsaEnv,
})(MsaDetailConfig)
