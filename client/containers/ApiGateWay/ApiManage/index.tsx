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
import { Button, Input, Table, Pagination, Menu, Form, Dropdown, Modal, notification, Icon, Radio } from 'antd'
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
  apiGroupId?: number
}
interface StateProps {
  clusterID: string
  list: [object],
  isFetching: boolean,
  total: number,
}
interface DispatchProps {
  getApiList(clusterID: string, query: object): any
  deleteApi(clusterID: string, id: string): any
  publishApi(clusterID: string, id: string, env: string, body: object): any
  offlineApi(clusterID: string, id: string, envId: string): any
  getPublishEnv(clusterID: string): any
}

type ApiManageProps = ComponentProps & StateProps & DispatchProps
class ApiManage extends React.Component<ApiManageProps> {
  state = {
    name: '',
    page: 0,
    size: 10,
    sort: 'd,createTime',
    publishModal: false,
    deleteModal: false,
    offlineModal: false,
    currentApi: { name: '' },
    publishEnv: [],
    loading: false,
  }
  componentDidMount() {
    this.onLoadList()
    this.onLoadPublishEnv()
  }
  onLoadPublishEnv = async () => {
    const { clusterID, getPublishEnv } = this.props
    const res = await getPublishEnv(clusterID)

    if (!res.error) {
      this.setState({
        publishEnv: res.response.result.data,
      })
    } else {
      notification.warn({
        message: '获取发布环境失败',
        description: res.error,
      })
    }

  }
  onLoadList = async () => {
    const { getApiList, clusterID, apiGroupId } = this.props
    const { name, page, size, sort } = this.state
    const query = { name, page, size, sort, apiGroupId }
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
      case 'publish':
        this.setState({
          publishModal: true,
        })
        return
      case 'delete':
        if (item.publishedInfo && item.publishedInfo !== '[]') {
          Modal.info({
            title: `API: ${item.name}`,
            icon: <Icon type="exclamation-circle" theme="filled" />,
            content: (
              <div>
                该 API 已经发布至 【测试环境 & API 市场】，请先从发布的环境中下线该API，方可删除该API
              </div>
            ),
            onOk() {},
          });
          return
        }
        this.setState({
          deleteModal: true,
        })
        return
      case 'offline':
        if (!item.publishedInfo || item.publishedInfo === '[]') {
          Modal.info({
            title: `API: ${item.name}`,
            icon: <Icon type="exclamation-circle" theme="filled" />,
            content: (
              <div>
                此Api还没有发布，暂不支持下线
              </div>
            ),
            onOk() {},
          });
          return
        }
        this.setState({
          offlineModal: true,
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
  onPublishOk = () => {
    const { clusterID, publishApi, form } = this.props
    form.validateFields(['publishEnv', 'memo'], async (err, values) => {
      if (err) { return }
      const { publishEnv, memo } = values
      this.setState({ loading: true })
      const { id } = this.state.currentApi
      const res = await publishApi(clusterID, id, publishEnv, { memo })
      if (res.error) {
        notification.warn({
          message: '发布API失败',
          description: res.error,
        })
      } else {
        notification.success({
          message: '发布API成功',
          description: '',
        })
      }
      this.onLoadList()
      this.setState({
        loading: false,
        publishModal: false,
      })
      form.resetFields()
    })
  }
  onOfflineOk = () => {
    const { currentApi } = this.state
    const { clusterID, offlineApi, form } = this.props
    form.validateFields(['offlineEnv'], async (err, values) => {
      if (err) { return }
      const { offlineEnv } = values
      const apiId = currentApi.id
      this.setState({ loading: true })
      const res = await offlineApi(clusterID, apiId, offlineEnv)
      if (!res.error) {
        notification.success({
          message: '下线成功',
          description: '',
        })
        this.onLoadList()
      } else {
        notification.warn({
          message: '下线失败',
          description: res.error,
        })
      }
      form.resetFields()
      this.setState({
        offlineModal: false,
        loading: false,
      })

    })
  }
  onDeleteOk = async () => {
    const { currentApi } = this.state
    const { clusterID, deleteApi } = this.props
    this.setState({ loading: true })
    const res = await deleteApi(clusterID, currentApi.id)
    if (!res.error) {
      notification.success({
        message: '删除成功',
        description: '',
      })
      this.onLoadList()
    } else {
      notification.warn({
        message: '删除失败',
        description: '',
      })
    }
    this.setState({
      deleteModal: false,
      loading: false,
    })
  }
  onCancel = () => {
    this.props.form.resetFields()
    this.setState({
      offlineModal: false,
      publishModal: false,
      deleteModal: false,
    })
  }
  onSwitchEnvName = flag => {
    switch (flag) {
      case 'public':
        return 'API 市场'
      case 'test':
        return '测试环境'
      default:
        return '-'
    }
  }
  render() {
    const { publishModal, deleteModal, offlineModal, currentApi, loading, publishEnv } = this.state
    const { list, isFetching, total } = this.props
    const { getFieldDecorator } = this.props.form
    const operationMenu = item => (
      <Menu onClick={target => this.onMenuClick(item, target)}>
        {/*<Menu.Item key="stop">停止</Menu.Item>*/}
        <Menu.Item key="edit">
          <Link to={`/api-gateway/api-manage-edit/${item.id}`}>编辑</Link>
        </Menu.Item>
        <Menu.Item key="debug">
          <Link to={`/api-gateway/api-detail/${item.id}/debug-api`}>API调试</Link>
        </Menu.Item>
        <Menu.Item key="publish">发布API</Menu.Item>
        <Menu.Item key="offline">下线</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: 'API 名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/api-gateway/api-detail/${record.id}/default`}>{text}</Link>,
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
        render: (text, record) => {
          if (record.publishedInfo) {
            const publishedInfo = JSON.parse(record.publishedInfo)
            let envName = ''
            switch (publishedInfo[0] && publishedInfo[0].envName) {
              case 'public':
                envName = 'API 市场'
                break
              default:
                envName = '-'
            }
            return <>{envName}</>
          }
          return <>-</>
        },
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
          <Link to={`/api-gateway/api-detail/${record.id}`}>管理</Link>
        </Dropdown.Button>,
      },
    ]
    let envId = ''
    if (currentApi.publishedInfo && currentApi.publishedInfo !== '[]') {
      envId = JSON.parse(currentApi.publishedInfo)[0].envId
    }
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
        visible={publishModal}
        onOk={this.onPublishOk}
        onCancel={this.onCancel}
        confirmLoading={loading}
      >
        <Form className="api-manage-release">
          <FormItem key="name" label="API" {...formItemLayout}>{currentApi.name}</FormItem>
          <FormItem key="env" label="选择发布环境" {...formItemLayout}>
            {
              getFieldDecorator('publishEnv', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请选择发布环境',
                  },
                ],
              })(
                <RadioGroup>
                  {publishEnv.map(v => <Radio
                    value={v.id}
                    disabled={envId === v.id}
                    key={v.id}
                  >
                    {this.onSwitchEnvName(v.flag)}
                  </Radio>)}
                </RadioGroup>,
              )
            }
          </FormItem>
          <FormItem key="remark" label="填写发布备注" {...formItemLayout}>
            {
              getFieldDecorator('memo', {
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
      <Modal
        title="下线 API"
        visible={offlineModal}
        onOk={this.onOfflineOk}
        onCancel={this.onCancel}
        confirmLoading={loading}
      >
        <Form className="api-manage-publish">
          <FormItem key="name" label="API" {...formItemLayout}>{currentApi.name}</FormItem>
          <FormItem key="env" label="选择要下线的环境" {...formItemLayout}>
            {
              getFieldDecorator('offlineEnv', {
                rules: [
                  {
                    required: true,
                    message: '请选择要下线的环境',
                  },
                ],
              })(
                <RadioGroup>
                  {publishEnv.map(v => <Radio value={v.id} key={v.id}>{this.onSwitchEnvName(v.flag)}</Radio>)}
                </RadioGroup>,
              )
            }
          </FormItem>
          <div className="warning-tips">
            <WarningIcon/>
            在此环境下线后将导致此API在指定的环境无法被访问，可能会影响相当一部分应用和用户。请确保已经告知用户，或者确认需要强制下线
          </div>
        </Form>
      </Modal>
      <Modal
        title="删除 API"
        visible={deleteModal}
        onOk={this.onDeleteOk}
        onCancel={this.onCancel}
        confirmLoading={loading}
      >
        <Form className="api-manage-delete">
          <div className="warning-tips">
            <><Icon type="warning" theme="filled" /></>
            <>
              删除API会导致调用该API的用户无法继续使用，请谨慎操作。<br/>
              确定要删除API“evaapi”吗？
            </>
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
      v.apiGroupName = v.apiGroup && v.apiGroup.name
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
  publishApi: apiManageAction.publishApi,
  getPublishEnv: apiManageAction.getPublishEnv,
  offlineApi: apiManageAction.offlineApi,
}

export default connect<StateProps, DispatchProps, ComponentProps>
(mapStateToProps, mapDispatchToProps)(Form.create()(ApiManage))
