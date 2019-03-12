/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * page ApiManage
 *
 * @author ZhouHaitao
 * @date 2019-03-06 10:42
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Table, Pagination, Menu, Form, Dropdown, Modal, notification, Radio } from 'antd'
import { connect } from 'react-redux'
import * as apiManageAction from '../../../actions/apiManage'
import QueueAnim from 'rc-queue-anim'
import './style/apiManage.less'
import * as apiGroupAction from '../../../actions/gateway';
import { Warning as WarningIcon } from '@tenx-ui/icon'
import { formatDate } from '../../../common/utils'
import _ from 'lodash'

const Search = Input.Search
const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

interface ComponentProps {

}
interface StateProps {
  clusterID: string
}
interface DispatchProps {
  getApiList(clusterID: string, query: object): any
  deleteApi(clusterID: string, id: string): any
}

type ApiManageProps = ComponentProps & StateProps & DispatchProps
class ApiManage extends React.Component<ApiManageProps> {

  state = {
    name: '',
    page: 0,
    size: 10,
    sort: 'd,createTime',
    releaseModal: false,
    currentApi: { name: '' },
  }
  componentDidMount() {
    this.onLoadList()
  }
  onLoadList = async () => {
    const { getApiList, clusterID } = this.props
    const { name, page, size, sort } = this.state
    const query = { name, page, size, sort }
    const res = await getApiList(clusterID, query)
    if (res.error) {
      notification.warn({
        message: '获取API列表失败',
        description: res.error,
      })
    }
  }
  onSearch = value => {
    this.setState({
      name: value,
    }, () => {
      this.onLoadList()
    })
  }
  onMenuClick = (item, target) => {
    this.setState({ currentApi: item })
    switch (target.key) {
      case 'stop':
        return
      case 'release':
        this.setState({
          releaseModal: true,
        })
        return
      default:
        return
    }
  }
  onRefrash = () => this.onLoadList()
  onChangePage = (page, pageSize) => {
    this.setState({ page: page - 1 }, () => {
      this.onLoadList()
    })
  }
  onTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      const sort = `${sorter.order[0]},${sorter.field}`
      this.setState({ sort }, () => {
        this.onLoadList()
      })
    }
  }
  onDropdownBtnClick = () => {
  }
  onReleaseOk = () => {
    this.setState({
      releaseModal: false,
    })
  }
  render() {
    const { releaseModal, currentApi } = this.state
    const { list, isFetching, total } = this.props
    const { getFieldDecorator } = this.props.form
    const operationMenu = item => (
      <Menu onClick={target => this.onMenuClick(item, target)}>
        <Menu.Item key="stop">停止</Menu.Item>
        <Menu.Item key="edit">
          <Link to="/api-gateway/api-manage-edit">编辑</Link>
        </Menu.Item>
        <Menu.Item key="debug">API调试</Menu.Item>
        <Menu.Item key="release">发布API</Menu.Item>
        <Menu.Item key="offline">下线</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: 'API 名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <Link to="/api-gateway/api-detail">{text}</Link>,
      },
      {
        title: '所属API组',
        dataIndex: 'apiGroupName',
        key: 'apiGroupName',
      },
      {
        title: '访问控制方式',
        dataIndex: 'authType',
        key: 'authType',
        filters: [
          { text: 'Basic-Auth', value: 'Basic-Auth' },
          { text: 'JWT', value: 'JWT' },
          { text: 'OAuth2', value: 'OAuth2' },
          { text: '无认证', value: 'none' },
        ],
        render: text => <>{text === '0' ? '无认证' : text}</>,
      },
      {
        title: '发布环境',
        dataIndex: 'publishedInfo',
        key: 'publishedInfo',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render: text => <>{formatDate(text)}</>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        render: text => <>{formatDate(text)}</>,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => <Dropdown.Button
          overlay={operationMenu(record)}
          onClick={() => this.onDropdownBtnClick(record)}
        >
          管理
        </Dropdown.Button>,
      },
    ]
    return <QueueAnim className="api-manage">
      <div className="operation-box">
        <div className="left">
          <Link to="/api-gateWay/api-manage-edit">
            <Button icon="plus" type="primary">
              创建 API
            </Button>
          </Link>
          <Button icon="sync" onClick={this.onRefrash}>
            刷新
          </Button>
          <Search
            placeholder="请输入 API名称搜索"
            onSearch={this.onSearch}
            style={{ width: 200 }}
          />
        </div>
        <div className="right">
          <span>共计 {total} 条</span>
          <Pagination
            simple
            total={total}
            onChange={this.onChangePage}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        loading={isFetching}
        pagination={false}
        onChange={this.onTableChange}
      />
      <Modal
        title="发布 API"
        visible={releaseModal}
        onOk={this.onReleaseOk}
        onCancel={() => this.setState({ releaseModal: false })}
      >
        <Form className="api-manage-release">
          <FormItem key="name" label="API" {...formItemLayout}>{currentApi.name}</FormItem>
          <FormItem key="env" label="选择发布环境" {...formItemLayout}>
            {
              getFieldDecorator('publishEnv', {
                initialValue: 'test',
              })(
                <RadioGroup>
                  <Radio value="test">测试环境</Radio>
                  <Radio value="market">API市场</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
          <FormItem key="remark" label="填写发布备注" {...formItemLayout}>
            {
              getFieldDecorator('publishRemark', {
                initialValue: '',
                rules: [{
                  required: true,
                  validator: (rule, val, cb) => {
                    if (!val) { return cb('请填写发布备注') }
                    if (val.length > 120) { return cb('不超过120字') }
                    return cb()
                  },
                }],
              })(
                <TextArea rows={4} placeholder="不超过20字"/>,
              )
            }
          </FormItem>
          <div className="warning-tips">
            <WarningIcon/>
            该操作将导致API市场的该API被覆盖，请仔细确认
          </div>
        </Form>
      </Modal>
    </QueueAnim>
  }
}

const mapStateToProps = (state: object) => {
  const { current: { config: { cluster: { clusterID } } } } = state
  const { apiManage: { apiList } } = state
  let isFetching = false
  let list = []
  let total = 0
  if (apiList) {
    list = _.cloneDeep(apiList.list)
    isFetching = apiList.isFetching
    total = apiList.total
    for (const v of list) {
      v.apiGroupName = v.apiGroup.name
    }
  }
  return {
    clusterID,
    list,
    isFetching,
    total,
  }
}
const mapDispatchToProps = {
  getApiList: apiManageAction.getApiList,
  deleteApi: apiManageAction.deleteApi,
}

export default connect<StateProps, DispatchProps, ComponentProps>
(mapStateToProps, mapDispatchToProps)(Form.create()(ApiManage))
