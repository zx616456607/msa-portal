/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetail
 *
 * 2018-11-05
 * @author zhouhaitao
 */
import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Form, Switch, Icon, Tooltip, Input, notification, Spin } from 'antd'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { getMsaBlownStrategy,
  getMsaBlownOpenStatus,
  setMsaBlownStrategy,
  msaBlownOpen,
  delMsaBlownStrategy,
} from '../../../../../actions/msa'
import './style/index.less'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
@connect(state => {
  const clusterID = state.current.config.cluster.id
  const blownStrategy = state.msa.msaBlownStrategy
  return {
    clusterID,
    blownStrategy,
  }
}, {
  getMsaBlownStrategy,
  getMsaBlownOpenStatus,
  setMsaBlownStrategy,
  msaBlownOpen,
  delMsaBlownStrategy,
})
class MsaDetailBlownStrategyComponent extends React.Component {
  state = {
    modalShow: false,
    delModal: false,
    blownOpen: false,
    blownOpenLoading: false,
    confirmLoading: false,
    delLoading: false,
    switchChecked: false,
    switchLoading: false,
  }
  componentDidMount() {
    const { getMsaBlownStrategy,
      serviceName,
      instances,
      clusterID,
      getMsaBlownOpenStatus } = this.props
    this.setState({ blownOpenLoading: true })
    getMsaBlownOpenStatus(clusterID, `${serviceName}:${instances[0].port}`).then(res => {
      if (res.response) {
        this.setState({
          blownOpen: res.response.result.data,
          blownOpenLoading: false,
        })
      }
    })
    getMsaBlownStrategy(clusterID, serviceName).then(res => {
      if (res.response) {
        this.setState({
          switchChecked: res.response.result.data.hystrixOpen,
        })
      }
    })
  }
  setBlownRules = () => {
    const { getMsaBlownStrategy, setMsaBlownStrategy, serviceName, clusterID } = this.props
    const { validateFields } = this.props.form
    validateFields(async (err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true })
        const body = Object.assign({}, values)
        body.serviceName = serviceName
        const result = await setMsaBlownStrategy(clusterID, body)
        this.setState({ confirmLoading: false })
        if (!result.error) {
          notification.success({ message: '设置熔断规则成功' })
          getMsaBlownStrategy(clusterID, serviceName)
          this.setState({
            modalShow: false,
          })
        }
      }
    })
  }
  requestVolumeThresholdValidate = () => {
    const { blownStrategy } = this.props
    const { data } = blownStrategy
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('requestVolumeThreshold', {
      initialValue: data && data.requestVolumeThreshold || 20,
      trigger: [ 'onBlur', 'onChange' ],
      rules: [
        { validator: (rule, value, callback) => {
          if (value === '') {
            return callback('请输入窗口请求数')
          }
          if (value < 1 || value > 10000 || value % 1 !== 0) {
            return callback('请输入1-10000之间的整数')
          }
          callback()
        },
        },
      ],
    })
  }
  errorThresholdPercentageValidate = () => {
    const { blownStrategy } = this.props
    const { data } = blownStrategy
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('errorThresholdPercentage', {
      initialValue: data && data.errorThresholdPercentage || 50,
      trigger: [ 'onBlur', 'onChange' ],
      rules: [
        { validator: (rule, value, callback) => {
          if (value === '') {
            return callback('请输入窗口请求失败率')
          }
          if (value < 0 || value > 100 || value % 1 !== 0) {
            return callback('请输入0-100之间的整数')
          }
          callback()
        },
        },
      ],

    })
  }
  sleepWindowInMillisecondsValidate = () => {
    const { blownStrategy } = this.props
    const { data } = blownStrategy
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('sleepWindowInMilliseconds', {
      initialValue: data && data.sleepWindowInMilliseconds || 15000,
      trigger: [ 'onBlur', 'onChange' ],
      rules: [
        { validator: (rule, value, callback) => {
          if (value === '') {
            return callback('请输入窗口请求失败率')
          }
          if (value < 0 || value > 3600000 || value % 1 !== 0) {
            return callback('请输入0-3,600,000之间的整数')
          }
          callback()
        },
        },
      ],
    })
  }
  delBlownRules = async () => {
    const { delMsaBlownStrategy, getMsaBlownStrategy, clusterID, serviceName } = this.props
    this.setState({ delLoading: true })
    const result = await delMsaBlownStrategy(clusterID, serviceName)
    if (!result.error) {
      notification.success({ message: '删除熔断规则成功' })
      this.setState({ delModal: false })
      getMsaBlownStrategy(clusterID, serviceName)
    }
    this.setState({ delLoading: false })
  }
  switchChange = async val => {
    const { msaBlownOpen, getMsaBlownStrategy, serviceName, clusterID } = this.props
    this.setState({ switchLoading: true })
    const result = await msaBlownOpen(clusterID, { open: val, serviceName })
    this.setState({ switchLoading: false })
    if (!result.error) {
      getMsaBlownStrategy(clusterID, serviceName)
      this.setState({
        switchChecked: val,
      })
    }
  }
  render() {
    const { blownStrategy } = this.props
    const { modalShow,
      delModal,
      blownOpen,
      confirmLoading,
      switchChecked,
      switchLoading,
      blownOpenLoading,
      delLoading,
    } = this.state
    const { data } = blownStrategy
    const title = data && data.hasRule ? '编辑熔断规则' : '设置熔断规则'
    return <div className="msa-detail-fusing">
      {
        blownOpenLoading ?
          <div className="loading">
            <Spin />
          </div>
          :
          <div>
            {
              blownOpen ?
                <div className="alert">
                  <TenxIcon type="tips"/>
                  添加熔断策略，支持设置开启或关闭熔断策略
                </div>
                :
                <div className="alert warning">
                  <TenxIcon type="warning"/>
                  服务未配置熔断功能，暂不支持熔断策略
                </div>
            }
            {
              data && data.hasRule ?
                blownOpen && <div className="strategy-wrapper">
                  <div className="btns">
                    <Button type="primary" icon="plus" onClick={() => this.setState({ modalShow: true })}>编辑熔断策略</Button>
                    <Button type="default" icon="delete" onClick={() => this.setState({ delModal: true })}>删除</Button>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>状态</td>
                        <td style={{ color: data.hystrixOpen ? '#5cb85c' : '#f85a5a' }}>{data.hystrixOpen ? '已开启' : '已关闭'}</td>
                      </tr>
                      <tr>
                        <td>窗口请求数</td>
                        <td>{data.requestVolumeThreshold}次</td>
                      </tr>
                      <tr>
                        <td>失败率</td>
                        <td>{data.errorThresholdPercentage}%</td>
                      </tr>
                      <tr>
                        <td>熔断时间窗</td>
                        <td>{data.sleepWindowInMilliseconds}ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                :
                blownOpen && <Button type="primary" icon="plus" onClick={() => this.setState({ modalShow: true })}>添加熔断策略</Button>
            }

          </div>
      }
      <Modal
        title={title}
        visible={ modalShow }
        onOk={this.setBlownRules}
        onCancel={() => this.setState({ modalShow: false })}
        confirmLoading={ confirmLoading }
      >
        <div className="msa-detail-blown-rules">
          <Form>
            <FormItem
              {...formItemLayout}
              label="默认开启">
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={switchChecked}
                loading={switchLoading}
                onChange={this.switchChange}
              />
              <div className="switch-tip">
                开启后，服务本身的熔断策略生效，直到关闭策略。
              </div>
            </FormItem>
            <div className="split">
              <span>触发条件，以下条件均满足时触发</span>
              <a/>
            </div>
            <FormItem
              {...formItemLayout}
              label={<span>窗口请求数(次)
                <Tooltip title="窗口收到的请求数">
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.requestVolumeThresholdValidate()(<Input type="text" placeholder="请输入1-10000之间的整数"/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<span>失败率 (%)
                <Tooltip title="窗口请求失败率">
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.errorThresholdPercentageValidate()(<Input type="text" placeholder="请输入0-100之间的整数"/>)
              }
            </FormItem>
            <div className="split second">
              <span>熔断触发后</span>
              <a/>
            </div>
            <FormItem
              {...formItemLayout}
              label={<span>熔断时间窗(ms)
                <Tooltip title="熔断的持续时间（该时间内不再响应请求）">
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.sleepWindowInMillisecondsValidate()(<Input type="text" placeholder="请输入0-3,600,000之间的整数"/>)
              }
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Modal
        title="删除熔断策略"
        visible={delModal}
        confirmLoading={delLoading}
        onOk={this.delBlownRules}
        onCancel={() => this.setState({ delModal: false })}
      >
        <div className="msa-detail-blown-rules-del">
          <Icon type="question-circle" theme="outlined" />
          是否删除该服务的熔断策略？
        </div>
      </Modal>
    </div>
  }
}

const MsaDetailBlownStrategy = Form.create()(MsaDetailBlownStrategyComponent)
export default MsaDetailBlownStrategy
