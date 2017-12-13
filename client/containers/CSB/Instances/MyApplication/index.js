/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Appliction
 *
 * 2017-12-11
 * @author zhaoyb
 */
import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Button, Icon, Input, Table, Pagination, Card, Modal } from 'antd'
import './style/index.less'
const Search = Input.Search

export default class MyApplication extends React.Component {
  state = {
    delVisible: false,
    isRevoke: false,
  }

  handleRevokeApply = () => {
    this.setState({
      delVisible: true,
    })
  }

  handleDelcancel = () => {
    this.setState({
      delVisible: false,
    })
  }
  filterState = key => {
    switch (key) {
      case '已通过':
        return <span className="adopt"><div></div>已通过</span>
      case '申请中':
        return <span className="apply"><div></div>申请中</span>
      case '已拒绝':
        return <span className="refuse"><div></div>已拒绝</span>
      default:
        return
    }
  }

  filterBtn = value => {
    switch (value) {
      case '已通过':
        return <Button type="primary" onClick={() => { }}>实例详情</Button>
      case '申请中':
        return <Button onClick={this.handleRevokeApply}>撤销申请</Button>
      case '已拒绝':
        return <div>--</div>
      default:
        return
    }
  }

  render() {
    const colmuns = [{
      id: '1',
      title: '实例名称',
      dataIndex: 'name',
    }, {
      title: '部署集群',
      dataIndex: 'cluster',
    }, {
      title: '申请时间',
      dataIndex: 'applyTirm',
      sorter: (a, b) => a.time - b.time,
    }, {
      title: '可发布服务',
      dataIndex: 'canRelease',
      filters: [{
        text: '是',
        value: '是',
      }, {
        text: '否',
        value: '否',
      }],
    }, {
      title: '可订阅服务',
      dataIndex: 'canBook',
      filters: [{
        text: '是',
        value: '是',
      }, {
        text: '否',
        value: '否',
      }],
    }, {
      title: '审批状态',
      dataIndex: 'state',
      filters: [{
        text: '已拒绝',
        value: '已拒绝',
      }, {
        text: '已通过',
        value: '已通过',
      }, {
        text: '申请中',
        value: '申请中',
      }],
      render: text => this.filterState(text),
    }, {
      title: '审批原因',
      dataIndex: 'trial',
    }, {
      title: '审批时间',
      dataIndex: 'trialTime',
      sorter: (a, b) => a.time - b.time,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => <div>
        {
          this.filterBtn(record.state)
        }
      </div>,
    }]
    const data = [{
      id: '1',
      name: '张三',
      cluster: '北京',
      applyTirm: '2017-12-11 11:12:00',
      state: '已拒绝',
      trial: '不可发布',
      canRelease: '是',
      canBook: '是',
      trialTime: '2017-12-11 11:12:10',
    }, {
      id: '2',
      name: '李四',
      cluster: '北京',
      applyTirm: '2017-12-11 11:12:00',
      state: '已通过',
      trial: '通过',
      canRelease: '否',
      canBook: '是',
      trialTime: '2017-12-11 11:12:10',
    }, {
      id: '3',
      name: '赵薇',
      cluster: '北京',
      applyTirm: '2017-12-11 11:12:00',
      state: '申请中',
      trial: '不可发布',
      canRelease: '否',
      canBook: '是',
      trialTime: '2017-12-11 11:12:10',
    }]
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    return (
      <QueueAnim className="csb-app">
        <div className="top">
          <Button type="primary"><Icon type="sync" />刷 新</Button>
          <Search
            className="text"
            placeholder="按实例名称搜索"
            style={{ width: 200 }}
            onSearch={value => console.log(value)}
          />
          <div className="page">
            <span>共计0条</span>
            <Pagination {...pagination} />
          </div>
        </div>
        <Card hoverable={false} >
          <Table
            pagination={false}
            columns={colmuns}
            dataSource={data}
            rowKey={row => row.id} />
        </Card>
        <Modal title="撤销申请实例"
          visible={this.state.delVisible}
          onCancel={this.handleDelcancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleDelcancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={() => { }}>撤 销</Button>,
          ]}>
          {
            <div className="modal-del-vouchers">
              <div className="img">
                <Icon type="exclamation-circle" />
              </div>
              <div className="desc">
                <span>是否确定撤销申请使用实例 ？</span>
              </div>
            </div>
          }
        </Modal>
      </QueueAnim>
    )
  }
}
