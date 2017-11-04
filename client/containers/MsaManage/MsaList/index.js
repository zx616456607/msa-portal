/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaList
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Icon, Input, Table } from 'antd'
const Search = Input.Search
import './style/msaList.less'
import classNames from 'classnames'
import { getMsaList } from '../../../actions/msa'

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
    {
      serviceName: 'config-client',
      discoverable: true,
      type: 'automatic',
      instances: [
        {
          name: 'CONFIG-CLIENT',
          instanceId: 'config-client-sample-3312784957-n1ts1:config-client',
          status: 'UP',
          ip: '10.24.42.166',
          port: 8080,
          type: 'automatic',
          discoverable: true,
        },
      ],
    },
    {
      serviceName: 'auth-server',
      discoverable: true,
      type: 'automatic',
      instances: [
        {
          name: 'AUTH-SERVER',
          instanceId: 'auth-server:auth-server:8080',
          status: 'UP',
          ip: '10.31.65.168',
          port: 8080,
          type: 'automatic',
          discoverable: true,
        },
      ],
    },
    {
      serviceName: 'zipkin-server',
      discoverable: true,
      type: 'automatic',
      instances: [
        {
          name: 'ZIPKIN-SERVER',
          instanceId: 'zipkin-server:zipkin-server:9411',
          status: 'UP',
          ip: '10.24.42.142',
          port: 9411,
          type: 'automatic',
          discoverable: true,
        },
      ],
    },
    {
      serviceName: 'configserver',
      discoverable: true,
      type: 'automatic',
      instances: [
        {
          name: 'CONFIGSERVER',
          instanceId: 'configserver:configserver:8888',
          status: 'UP',
          ip: '10.24.42.132',
          port: 8888,
          type: 'automatic',
          discoverable: true,
        },
      ],
    },
    {
      serviceName: 'gateway',
      discoverable: true,
      type: 'automatic',
      instances: [
        {
          name: 'GATEWAY',
          instanceId: 'gateway:gateway:8765',
          status: 'UP',
          ip: '10.24.42.138',
          port: 8765,
          type: 'automatic',
          discoverable: true,
        },
      ],
    },
  ],
}


class MsaList extends React.Component {
  state = {
    msaModal: false,
  }
  componentWillMount() {
    const { getMsaList, clusterID } = this.props
    getMsaList(clusterID)
  }

  registerMsa = () => {
    this.props.history.push('/msa-manage/register')
  }
  render() {
    const { msaList } = this.props
    const columns = [{
      title: '微服务名称',
      dataIndex: 'serviceName',
      width: '20%',
      render: text => <Link to={`/msa-manage/detail/${text}?name=${text}`}>{text}</Link>,
    }, {
      title: '服务状态',
      dataIndex: 'status',
      width: '20%',
    }, {
      title: '注册类型',
      dataIndex: 'type',
      width: '20%',
      render: text => {
        return <div>{text === 'automatic' ? '自动注册' : '手动注册'}</div>
      },
    }, {
      title: '状态',
      dataIndex: 'discoverable',
      width: '20%',
      render: text =>
        <span className={classNames('msa-table-status-box', { 'msa-table-running': text, 'msa-table-error': !text })}>
          <i className="msa-table-status"/>{text ? '可被发现' : '不可被发现'}
        </span>,
    }, {
      title: '操作',
      width: '20%',
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
      }),
    }
    const pagination = {
      simple: true,
    }
    return (
      <div className="msa">
        <div className="msa-btn-box layout-content-btns">
          <Button type="primary" onClick={this.registerMsa}><Icon type="plus"/>注册微服务</Button>
          <Button><Icon type="poweroff"/>注销微服务</Button>
          <Button><Icon type="sync"/>刷新</Button>
          <Search
            placeholder="按微服务名称搜索"
            style={{ width: 200 }}
          />
          <span className="float-right msa-btn-box-total">共计 3 条</span>
        </div>
        <Table
          className="msa-table"
          pagination={pagination}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={msaList} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current /* msa */ } = state
  const { id } = current.config.cluster
  // const { msaList } = msa
  function getServiceStatus(data) {
    if (!data.length) result
    let upNum = 0
    data.forEach(item => {
      if (item.status === 'UP') {
        upNum++
      }
    })
    return `${upNum}/${data.length}`
  }
  function formateList(source) {
    return source.map(item => {
      return Object.assign(item, { status: getServiceStatus(item.instances) })
    })
  }
  return {
    clusterID: id,
    msaList: formateList(result.data), // 部署完此方法可删掉，直接取store里面的masList
  }
}

export default connect(mapStateToProps, {
  getMsaList,
})(MsaList)
