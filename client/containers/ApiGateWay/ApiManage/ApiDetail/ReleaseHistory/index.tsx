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
import { Table, Button, Input, Pagination, Modal, Form, Radio } from 'antd'
import { Send as SendIcon } from '@tenx-ui/icon'
import './style/releaseHistory.less'

const{ Search, TextArea } = Input
const RadioGroup = Radio.Group
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
interface ReleaseHistoryProps {
  apiData: object
}

class ReleaseHistory extends React.Component<ReleaseHistoryProps> {
  state = {
    versionModalShow: false,
    releaseModalShow: false,
    switchLoading: false,
  }
  onSwitchModalShow = () => this.setState({ versionModalShow: !this.state.versionModalShow })
  onReleaseModalShow = () => this.setState({ releaseModalShow: !this.state.releaseModalShow })
  onConfirmSwitch = () => {
    this.setState({
      versionModalShow: false,
    })
  }
  onConfirmRelease = () => {
    this.setState({
      releaseModalShow: false,
    })
  }
  render() {
    const { versionModalShow, releaseModalShow, switchLoading } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    const { apiData } = this.props
    const releaseEnvValidator = getFieldDecorator('releaseEnv', {
      initialValue: 'test',
    })
    const remarkValidator = getFieldDecorator('remark', {
      initialValue: '',
      rules: [{
        required: true,

      }, {
        validator: (rule, val, cb) => {
          if (!val) { return cb('请填写发布备注') }
          if (val.length > 120) { return cb('不超过120字') }
          cb()
        },
    }],
    })
    const columns = [
      {
        title: '版本',
        key: 'version',
        dataIndex: 'version',
      },
      {
        title: '发布备注',
        key: 'remark',
        dataIndex: 'remark',
      },
      {
        title: '环境',
        key: 'env',
        dataIndex: 'env',
      },
      {
        title: '发布时间',
        key: 'createTime',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return <span>
            <Button type="primary" ghost>查看版本</Button>
            {true && <Button onClick={this.onSwitchModalShow}>切换至此版本</Button>}
          </span>
        },
      },
    ]
    const data = []
    return <div className="release-history">
      <div className="top-operation">
        <div className="left">
          <Button type="primary" onClick={this.onReleaseModalShow}>
            <SendIcon/>
            发布
          </Button>
          <Button icon="sync">刷新</Button>
          <Search placeholder="请输入版本搜索"/>
        </div>
        <div className="right">
          <span>共6条</span>
          <Pagination
            simple
            pagination={false}
            total={50}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
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
      </Modal>
      <Modal
        title="发布 API"
        visible={releaseModalShow}
        onCancel={this.onReleaseModalShow}
        footer={[
          <Button onClick={this.onReleaseModalShow} key="cancel2">取消</Button>,
          <Button onClick={this.onConfirmRelease} key="confirm2" type="primary" loading={switchLoading}>发布</Button>,
        ]}
      >
        <Form>
          <div className="release-history-release">
            <Form.Item {...formLayout} label="API"> {apiData.name} </Form.Item>
            <Form.Item
              {...formLayout}
              label="选择发布环境"
            >
              {
                releaseEnvValidator(<RadioGroup>
                    <Radio value="test">测试环境</Radio>
                    <Radio value="apiMarket">API 市场</Radio>
                  </RadioGroup>,
                )
              }
            </Form.Item>
            <Form.Item
              {...formLayout}
              label="填写发布备注"
            >
              {
                remarkValidator(<TextArea placeholder="请填写发布备注"/>)
              }
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(ReleaseHistory)
