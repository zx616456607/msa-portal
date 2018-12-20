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
import { withNamespaces } from 'react-i18next'

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
@withNamespaces('MsaList')
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
        })
      }
      this.setState({ blownOpenLoading: false })
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
    const { getMsaBlownStrategy, setMsaBlownStrategy, serviceName, clusterID, t } = this.props
    const { validateFields } = this.props.form
    validateFields(async (err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true })
        const body = Object.assign({}, values)
        body.serviceName = serviceName
        const result = await setMsaBlownStrategy(clusterID, body)
        this.setState({ confirmLoading: false })
        if (!result.error) {
          notification.success({ message: t('detail.MsaDetailBlownStrategy.setMsaBlownStrategySucc') })
          getMsaBlownStrategy(clusterID, serviceName)
          this.setState({
            modalShow: false,
          })
        }
      }
    })
  }
  requestVolumeThresholdValidate = () => {
    const { blownStrategy, t } = this.props
    const { data } = blownStrategy
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('requestVolumeThreshold', {
      initialValue: data && data.requestVolumeThreshold || 20,
      trigger: [ 'onBlur', 'onChange' ],
      rules: [
        { validator: (rule, value, callback) => {
          if (value === '') {
            return callback(t('detail.MsaDetailBlownStrategy.requestVolumeThresholdErr1'))
          }
          if (value < 1 || value > 10000 || value % 1 !== 0) {
            return callback(t('detail.MsaDetailBlownStrategy.requestVolumeThresholdErr2'))
          }
          callback()
        },
        },
      ],
    })
  }
  errorThresholdPercentageValidate = () => {
    const { blownStrategy, t } = this.props
    const { data } = blownStrategy
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('errorThresholdPercentage', {
      initialValue: data && data.errorThresholdPercentage || 50,
      trigger: [ 'onBlur', 'onChange' ],
      rules: [
        { validator: (rule, value, callback) => {
          if (value === '') {
            return callback(t('detail.MsaDetailBlownStrategy.errorThresholdPercentageErr1'))
          }
          if (value < 0 || value > 100 || value % 1 !== 0) {
            return callback(t('detail.MsaDetailBlownStrategy.errorThresholdPercentageErr2'))
          }
          callback()
        },
        },
      ],

    })
  }
  sleepWindowInMillisecondsValidate = () => {
    const { blownStrategy, t } = this.props
    const { data } = blownStrategy
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('sleepWindowInMilliseconds', {
      initialValue: data && data.sleepWindowInMilliseconds || 15000,
      trigger: [ 'onBlur', 'onChange' ],
      rules: [
        { validator: (rule, value, callback) => {
          if (value === '') {
            return callback(t('detail.MsaDetailBlownStrategy.sleepWindowInMillisecondsErr1'))
          }
          if (value < 0 || value > 3600000 || value % 1 !== 0) {
            return callback(t('detail.MsaDetailBlownStrategy.sleepWindowInMillisecondsErr2'))
          }
          callback()
        },
        },
      ],
    })
  }
  delBlownRules = async () => {
    const { t, delMsaBlownStrategy, getMsaBlownStrategy, clusterID, serviceName } = this.props
    this.setState({ delLoading: true })
    const result = await delMsaBlownStrategy(clusterID, serviceName)
    if (!result.error) {
      notification.success({ message: t('detail.MsaDetailBlownStrategy.delMsaBlownStrategySucc') })
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
    const { blownStrategy, t } = this.props
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
    const title = data && data.hasRule ? t('detail.MsaDetailBlownStrategy.editBlownStrategy') : t('detail.MsaDetailBlownStrategy.setBlownStrategy')
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
                  {t('detail.MsaDetailBlownStrategy.alert')}
                </div>
                :
                <div className="alert warning">
                  <TenxIcon type="warning"/>
                  {t('detail.MsaDetailBlownStrategy.alertWarning')}
                </div>
            }
            {
              data && data.hasRule ?
                blownOpen && <div className="strategy-wrapper">
                  <div className="btns">
                    <Button type="primary" icon="plus" onClick={() => this.setState({ modalShow: true })}>{t('detail.MsaDetailBlownStrategy.edit')}</Button>
                    <Button type="default" icon="delete" onClick={() => this.setState({ delModal: true })}>{t('detail.MsaDetailBlownStrategy.delete')}</Button>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>{t('detail.MsaDetailBlownStrategy.status')}</td>
                        <td style={{ color: data.hystrixOpen ? '#5cb85c' : '#f85a5a' }}>{data.hystrixOpen ? t('detail.MsaDetailBlownStrategy.opened') : t('detail.MsaDetailBlownStrategy.closed')}</td>
                      </tr>
                      <tr>
                        <td>{t('detail.MsaDetailBlownStrategy.requestVolumeThresholdCount')}</td>
                        <td>{data.requestVolumeThreshold}{t('detail.MsaDetailBlownStrategy.count')}</td>
                      </tr>
                      <tr>
                        <td>{t('detail.MsaDetailBlownStrategy.errorThresholdPercentage')}</td>
                        <td>{data.errorThresholdPercentage}%</td>
                      </tr>
                      <tr>
                        <td>{t('detail.MsaDetailBlownStrategy.sleepWindowInMilliseconds')}</td>
                        <td>{data.sleepWindowInMilliseconds}ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                :
                blownOpen && <Button type="primary" icon="plus" onClick={() => this.setState({ modalShow: true })}>{t('detail.MsaDetailBlownStrategy.add')}</Button>
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
              label={t('detail.MsaDetailBlownStrategy.defaultOpened')}>
              <Switch
                checkedChildren={t('detail.MsaDetailBlownStrategy.open')}
                unCheckedChildren={t('detail.MsaDetailBlownStrategy.close')}
                checked={switchChecked}
                loading={switchLoading}
                onChange={this.switchChange}
              />
              <div className="switch-tip">
                {t('detail.MsaDetailBlownStrategy.openTip')}
              </div>
            </FormItem>
            <div className="split">
              <span>{t('detail.MsaDetailBlownStrategy.triggerTip')}</span>
              <a/>
            </div>
            <FormItem
              {...formItemLayout}
              label={<span>{t('detail.MsaDetailBlownStrategy.requestCount')}
                <Tooltip title={t('detail.MsaDetailBlownStrategy.requestCountTip')}>
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.requestVolumeThresholdValidate()(<Input type="text" placeholder={t('detail.MsaDetailBlownStrategy.requestVolumeThresholdErr2')}/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<span>{t('detail.MsaDetailBlownStrategy.failedPercent')} (%)
                <Tooltip title={t('detail.MsaDetailBlownStrategy.failedPercentTip')}>
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.errorThresholdPercentageValidate()(<Input type="text" placeholder={t('detail.MsaDetailBlownStrategy.failedPercentPlaceholder')}/>)
              }
            </FormItem>
            <div className="split second">
              <span>{t('detail.MsaDetailBlownStrategy.afterBlown')}</span>
              <a/>
            </div>
            <FormItem
              {...formItemLayout}
              label={<span>{t('detail.MsaDetailBlownStrategy.blownTime')}(ms)
                <Tooltip title={t('detail.MsaDetailBlownStrategy.blownTimeTip')}>
                  <Icon style={{ marginLeft: 4 }} type="question-circle" theme="outlined" />
                </Tooltip>
              </span>}>
              {
                this.sleepWindowInMillisecondsValidate()(<Input type="text" placeholder={t('detail.MsaDetailBlownStrategy.blownTimePlaceholder')}/>)
              }
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Modal
        title={t('detail.MsaDetailBlownStrategy.delTitle')}
        visible={delModal}
        confirmLoading={delLoading}
        onOk={this.delBlownRules}
        onCancel={() => this.setState({ delModal: false })}
      >
        <div className="msa-detail-blown-rules-del">
          <Icon type="question-circle" theme="outlined" />
          {t('detail.MsaDetailBlownStrategy.delContent')}
        </div>
      </Modal>
    </div>
  }
}

const MsaDetailBlownStrategy = Form.create()(MsaDetailBlownStrategyComponent)
export default MsaDetailBlownStrategy
