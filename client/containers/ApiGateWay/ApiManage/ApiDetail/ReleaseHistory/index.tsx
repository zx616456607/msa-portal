/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * component ReleaseHistory
 *
 * @author ZhouHaitao
 * @date 2019-03-08 10:42
 */
import * as React from 'react'
import { Table, Button, Input, Pagination, Modal, Form, Radio, Drawer, notification, Tooltip } from 'antd'
import { Send as SendIcon } from '@tenx-ui/icon'
import { withRouter } from 'react-router'
import * as apiManageActions from '../../../../../actions/apiManage'
import './style/releaseHistory.less'
import { connect } from 'react-redux';
import { formatDate } from '../../../../../common/utils';
import { Warning as WarningIcon } from '@tenx-ui/icon'
import Ellipsis from '@tenx-ui/ellipsis'

const{ Search, TextArea } = Input
const RadioGroup = Radio.Group
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

interface ComponentProps {
  apiData: object
}
interface StateProps {
  clusterID: string
}
interface DispatchProps {
  getPublicHistory(clusterID: string, id: string, query: object): any
  getPublishEnv(clusterID: string): any
  publishApi(clusterID: string): any
  onLoadApiData(): any
}
type ReleaseHistoryProps = StateProps & DispatchProps & ComponentProps

class ReleaseHistory extends React.Component<ReleaseHistoryProps> {
  state = {
    version: '',
    page: 0,
    size: 10,
    sort: 'd,createTime',
    versionModalShow: false,
    releaseModalShow: false,
    switchLoading: false,
    versionVisible: false,
    listData: [],
    publishEnv: [],
    total: 0,
    loading: false,
    publishLoading: false,
    envId: '',
  }
  componentDidMount() {
    this.onLoadList()
    this.onLoadPublishEnv()
  }
  onLoadList = async () => {
    const { getPublicHistory, clusterID, match } = this.props
    const { version, page, size, sort, envId } = this.state
    const id = match.params.id
    const query = { version, page, size, sort, envId }
    this.setState({ loading: true })
    const res = await getPublicHistory(clusterID, id, query)
    this.setState({ loading: false })
    if (!res.error) {
       this.setState({
         listData: res.response.result.data.content,
         total: res.response.result.data.totalElements,
       })
    }
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
  onSwitchModalShow = () => this.setState({ versionModalShow: !this.state.versionModalShow })
  onReleaseModalShow = () => this.setState({ releaseModalShow: !this.state.releaseModalShow })
  onConfirmSwitch = () => {
    this.setState({
      versionModalShow: false,
    })
  }
  onConfirmRelease = () => {
    const { clusterID, publishApi, form } = this.props
    form.validateFields(['publishEnv', 'memo'], async (err, values) => {
      if (err) { return }
      const { publishEnv, memo } = values
      this.setState({ publishLoading: true })
      const { id } = this.props.apiData
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
        this.props.onLoadApiData()
      }
      this.onLoadList()
      this.setState({
        publishLoading: false,
        releaseModalShow: false,
      })
      form.resetFields()
    })
  }
  onCheckVersion = () => {
    this.setState({
      versionVisible: true,
    });
  };
  onClose = () => {
    this.setState({
      versionVisible: false,
    });
  };
  onTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      const sort = `${sorter.order[0]},${sorter.field}`
      this.setState({ sort }, () => {
        this.onLoadList()
      })
    }
    if (filters.env.length !== 0) {
      this.setState({
        envId: filters.env[0],
      }, () => {
        this.onLoadList()
      })
    } else {
      this.setState({
        envId: '',
      }, () => {
        this.onLoadList()
      })
    }
  }
  onSearch = value => {
    this.setState({
      version: value,
    }, () => {
      this.onLoadList()
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
  onChangePage = (page, pageSize) => {
    this.setState({ page: page - 1 }, () => {
      this.onLoadList()
    })
  }
  onFilters = () => {
    const { publishEnv } = this.state
    const filters = []
    publishEnv.map(v => {
      filters.push({
        text: this.onSwitchEnvName(v.flag),
        value: v.id,
      })
    })
    return filters
  }
  render() {
    const { releaseModalShow, publishLoading, versionVisible, listData, total, loading, publishEnv } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    const { apiData } = this.props
    const columns = [
      {
        title: '版本',
        key: 'version',
        dataIndex: 'version',
        width: 300,
      },
      {
        title: '发布备注',
        key: 'memo',
        dataIndex: 'memo',
        width: 200,
        render: text => <div className="remark">
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        </div>,
      },
      {
        title: '环境',
        key: 'env',
        dataIndex: 'env',
        width: 300,
        filters: this.onFilters(),
        filterMultiple: false,
        render: (text, record) => <>{this.onSwitchEnvName(record.envName)}</>,
      },
      {
        title: '发布时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: 300,
        sorter: true,
        render: text => <>{formatDate(text)}</>,
      },
      {
/*
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return <span>
            <Button type="primary" ghost className="check-version" onClick={this.onCheckVersion}>查看版本</Button>
            {false && <Button onClick={this.onSwitchModalShow}>切换至此版本</Button>}
          </span>
        },
*/
      },
    ]
    let envId = ''
    if (apiData.publishedInfo && apiData.publishedInfo !== '[]') {
      envId = JSON.parse(apiData.publishedInfo)[0].envId
    }

    return <div className="release-history">
      <div className="top-operation">
        <div className="left">
          <Button type="primary" onClick={this.onReleaseModalShow}>
            <SendIcon/>
            发布
          </Button>
          <Button icon="sync" onClick={this.onLoadList}>刷新</Button>
          <Search placeholder="请输入版本搜索" onSearch={this.onSearch}/>
        </div>
        <div className="right">
          <span>共{total}条</span>
          <Pagination
            simple
            pagination={false}
            total={total}
            onChange={this.onChangePage}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={listData}
        pagination={false}
        loading={loading}
        onChange={this.onTableChange}
      />
{/*      <Modal
        title="切换 API 版本"
        visible={versionModalShow}
        onCancel={this.onSwitchModalShow}
        footer={[
          <Button onClick={this.onSwitchModalShow} key="cancel">取消</Button>,
          <Button onClick={this.onConfirmSwitch} key="confirm" type="primary" loading={switchLoading}>切换</Button>,
        ]}
      >
        <div className="release-history-switch">
          <p>您将在测试环境，切换API组：<span> {apiData.name} </span>的版本</p>
          <p>当前版本： {apiData.version}</p>
          <p>切换至版本： 2019336587</p>
        </div>
      </Modal>*/}
      <Modal
        title="发布 API"
        visible={releaseModalShow}
        confirmLoading={loading}
        onCancel={this.onReleaseModalShow}
        footer={[
          <Button onClick={this.onReleaseModalShow} key="cancel2">取消</Button>,
          <Button onClick={this.onConfirmRelease} key="confirm2" type="primary" loading={publishLoading}>发布</Button>,
        ]}

      >
        <Form className="api-manage-release">
          <Form.Item key="name" label="API" {...formLayout}>{apiData.name}</Form.Item>
          <Form.Item key="env" label="选择发布环境" {...formLayout}>
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
                  </Radio>,
                  )}
                </RadioGroup>,
              )
            }
          </Form.Item>
          <Form.Item key="remark" label="填写发布备注" {...formLayout}>
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
          </Form.Item>
          <div className="warning-tips">
            <WarningIcon/>
            该操作将导致API市场的该API被覆盖，请仔细确认
          </div>
        </Form>
      </Modal>
      <Drawer
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={versionVisible}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  }
}

const mapStateToProps = (state: object): StateProps => {
  const { current: { config: { cluster: { clusterID } } } } = state
  return {
    clusterID,
  }
}
const mapDispatchToProps = {
  getPublicHistory: apiManageActions.getPublicHistory,
  getPublishEnv: apiManageActions.getPublishEnv,
  publishApi: apiManageActions.publishApi,
}
export default connect<StateProps, DispatchProps, ComponentProps>
(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReleaseHistory)))
