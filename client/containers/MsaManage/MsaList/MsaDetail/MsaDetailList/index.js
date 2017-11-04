/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetail-list
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Input, Icon, Table } from 'antd'
import classNames from 'classnames'
import { parse as parseQuerystring } from 'query-string'
import './style/index.less'
import { getMsaList } from '../../../../../actions/msa'

const Search = Input.Search

const result = {
  status: 'success',
  code: 200,
  data: [
    {
      serviceName: 'hystrix-turbine',
      discoverable: true,
      type: 'automatic',
      instances: [
        {
          name: 'HYSTRIX-TURBINE',
          instanceId: 'hystrix:hystrix-turbine:8031',
          status: 'UP',
          ip: '10.31.65.185',
          port: 8031,
          type: 'automatic',
          discoverable: true,
        },
      ],
    },
  ],
}
class MsaDetailList extends React.Component {
  componentDidMount() {
    const { getMsaList, clusterId, name } = this.props
    getMsaList(clusterId, { name })
  }
  render() {
    // const { instancesList } = this.props
    const pagination = {
      simple: true,
    }
    const columns = [{
      title: '实例名称',
      dataIndex: 'name',
      width: '15%',
    }, {
      title: '微服务 实例ID',
      dataIndex: 'instanceId',
      width: '15%',
    }, {
      title: '实例状态',
      dataIndex: 'status',
      width: '10%',
    }, {
      title: '服务地址',
      dataIndex: 'ip',
      width: '10%',
    }, {
      title: '服务端口',
      dataIndex: 'port',
      width: '10%',
    }, {
      title: '注册类型',
      dataIndex: 'type',
      width: '10%',
      render: text => (text === 'automatic' ? '自动注册' : '手动注册'),
    }, {
      title: '状态',
      dataIndex: 'discoverable',
      width: '10%',
      render: text =>
        <span className={classNames('msa-table-status-box', { 'msa-table-running': text, 'msa-table-error': !text })}>
          <i className="msa-table-status"/>{text ? '可被发现' : '不可被发现'}
        </span>,
    }, {
      title: '操作',
      width: '10%',
      render: record => {
        return (
          <div>
            {
              record.type === 'automatic' ? record.discoverable ? <Button>隐藏服务</Button> : <Button>取消隐藏</Button> : ''
            }
            {
              record.type !== 'automatic' ? <Button>移除注册</Button> : ''
            }
          </div>
        )
      },
    }]
    return (
      <div className="msaDetailList">
        <div className="layout-content-btns">
          <Button type="primary"><Icon type="sync"/>刷新</Button>
          <Search placeholder="按服务名称搜索" style={{ width: '200px' }}/>
        </div>
        <Table
          className="msaDetailList-table"
          pagination={pagination}
          columns={columns}
          dataSource={result.data[0].instances} /> /* 部署完直接用props里面的 instancesList.instances */
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current, msa, routing } = state
  const { id } = current.config.cluster
  const { msaList } = msa
  const { search } = routing.location
  const { name } = parseQuerystring(search)
  return {
    clusterID: id,
    name,
    instancesList: msaList.data, // 部署完此方法可删掉，直接取store里面的masList
  }
}

export default connect(mapStateToProps, {
  getMsaList,
})(MsaDetailList)
