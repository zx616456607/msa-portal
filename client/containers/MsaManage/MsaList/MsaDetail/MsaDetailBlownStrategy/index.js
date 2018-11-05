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
import { Button, Modal, Form, Switch, Icon, Tooltip, Input } from 'antd'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { getMsaBlownStrategy } from '../../../../../actions/msa'
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
})
class MsaDetailBlownStrategyComponent extends React.Component {
  state = {
    modalShow: false,
    delModal: false,
  }
  componentDidMount() {
    const { getMsaBlownStrategy } = this.props
    getMsaBlownStrategy()
  }
  setBlownRules = () => {
    const { validateFields } = this.props.form
    validateFields(err => {
      if (!err) {
        this.setState({
          modalShow: false,
        })
      }
    })
  }

  switchValidate = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('switch', {
      valuePropName: 'checked',
      initialValue: false,
    })
  }
  reqNumsValidate = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('reqNums', {
      initialValue: '',
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
  failureRateValidate = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('failureRate', {
      initialValue: '',
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
  timeWindowValidate = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('timeWindow', {
      initialValue: '',
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
  delBlownRules = () => {
    this.setState({ delModal: false })
  }
  render() {
    const { blownStrategy } = this.props
    const { modalShow, delModal } = this.state
    const { data } = blownStrategy
    const title = data && Object.keys(data).length !== 0 ? '编辑熔断规则' : '设置熔断规则'
    return <div className="msa-detail-fusing">
      <div className="alert">
        <TenxIcon type="tips"/>
        添加熔断策略，支持设置开启或关闭熔断策略
      </div>
      {
        data && Object.keys(data).length !== 0 ?
          <div className="strategy-wrapper">
            <div className="btns">
              <Button type="primary" icon="plus" onClick={() => this.setState({ modalShow: true })}>编辑熔断策略</Button>
              <Button type="default" icon="delete" onClick={() => this.setState({ delModal: true })}>删除</Button>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>状态</td>
                  <td style={{ color: '#5cb85c' }}>{data.status === '0' ? '已关闭' : '已开启'}</td>
                </tr>
                <tr>
                  <td>窗口请求数</td>
                  <td>{data.reqNums}次</td>
                </tr>
                <tr>
                  <td>失败率</td>
                  <td>{data.failureRate}%</td>
                </tr>
                <tr>
                  <td>熔断时间窗</td>
                  <td>{data.time}ms</td>
                </tr>
              </tbody>
            </table>
          </div>
          :
          <Button type="primary" icon="plus" onClick={() => this.setState({ modalShow: true })}>添加熔断策略</Button>
      }
      <Modal
        title={title}
        visible={ modalShow }
        onOk={this.setBlownRules}
        onCancel={() => this.setState({ modalShow: false })}
      >
        <div className="msa-detail-blown-rules">
          <Form>
            <FormItem
              {...formItemLayout}
              label="默认开启">
              {
                this.switchValidate()(<Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                />)
              }

              <div className="switch-tip">
                开启后，服务本身的降级策略生效，直到关闭策略；若服务本身未设置降级策略，开关不生效
              </div>
            </FormItem>
            <div className="split">
              <span>触发条件，以下条件均满足时触发</span>
              <a/>
            </div>
            <FormItem
              {...formItemLayout}
              label={<span>窗口请求数
                <Tooltip title="窗口收到的请求数">
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.reqNumsValidate()(<Input type="text" placeholder="请输入1-10000之间的整数"/>)
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
                this.failureRateValidate()(<Input type="text" placeholder="请输入0-100之间的整数"/>)
              }
            </FormItem>
            <div className="split second">
              <span>熔断触发后</span>
              <a/>
            </div>
            <FormItem
              {...formItemLayout}
              label={<span>熔断时间窗
                <Tooltip title="熔断的持续时间（该时间内不再响应请求）">
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.timeWindowValidate()(<Input type="text" placeholder="请输入0-3,600,000之间的整数"/>)
              }
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Modal
        title="删除熔断策略"
        visible={delModal}
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
