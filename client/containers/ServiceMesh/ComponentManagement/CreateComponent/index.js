/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CreateComponent container
 *
 * 2018-09-30
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Button, Input, Card, Form, Row, Col, Icon, Select, notification } from 'antd'
import './style/index.less'
import { APP_NAME_REG_NOTICE } from '../../../../constants'
import { AddComponent, fetchServiceList, loadComponent, fetchComponent, editComponent } from '../../../../actions/serviceMesh'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
let uuid = 0

class CreateComponent extends React.Component {
  state = {
    isAdd: true,
    serviceAry: [],
    componentList: [],
    moduleServiceList: [],
  }

  componentWillMount() {
    const isAdd = this.props.location.search.split('=')[1]
    this.fetchServiceList()
    if (isAdd === 'false') {
      const componentName = this.props.location.pathname.split('/')[3]
      this.fetchList(componentName)
    }
  }

  componentWillUnmount() {
    uuid = 0
  }

  setFrom = () => {
    const keys = []
    const { componentList } = this.state
    const { form } = this.props
    if (componentList) {
      const obj = {}
      const { subsets } = componentList.spec
      if (subsets) {
        subsets.forEach((item, index) => {
          keys.push(uuid++)
          Object.assign(obj, {
            [`serviceName-${index}`]: item.name,
            [`version-${index}`]: item.labels.version,
          })
          this.setState({
            [`service${index}`]: true,
          })
        })
        form.setFieldsValue({
          keys,
        })
        setTimeout(() => {
          form.setFieldsValue(obj)
        }, 1000)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const isAdd = nextProps.location.search.split('=')[1]
    if (isAdd === 'true') {
      this.setState({
        isAdd: true,
      })
    } else {
      this.setState({
        isAdd: false,
      })
    }
  }

  fetchList = name => {
    const { clusterID, namespace, fetchComponent } = this.props
    const query = {
      name,
      project: namespace,
    }
    fetchComponent(clusterID, query).then(res => {
      if (res.error) {
        return
      }
      this.setState({
        componentList: res.response.result,
      }, () => {
        this.setFrom()
      })
    })
  }

  fetchServiceList = () => {
    const { clusterID, namespace, fetchServiceList } = this.props
    fetchServiceList(clusterID, namespace).then(res => {
      if (res.error) {
        return
      }
      const aryList = []
      const list = res.response.result
      Object.keys(list).forEach(item => {
        const moduleValue = list[item].metadata.labels['servicemesh/app-module']
        if (moduleValue) {
          aryList.push(item)
        }
      })
      this.setState({
        moduleServiceList: aryList,
      })
    })
  }

  handleAdd = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(uuid)
    uuid++
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  handleRemove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  filterServiceName = desc => {
    const { form } = this.props
    const { getFieldValue } = form
    const keys = getFieldValue('keys')
    const query = {}
    keys.forEach(key => {
      const nameKey = `svcName/${getFieldValue(`serviceName-${key}`)}`
      const valueKey = `${getFieldValue(`version-${key}`)}`
      query[nameKey] = valueKey
      query.description = desc
    })
    return query
  }

  filterSubsets = () => {
    const { form } = this.props
    const { getFieldValue } = form
    const keys = getFieldValue('keys')
    const subAry = []
    keys.forEach(key => {
      const query = {
        labels: {
          version: `${getFieldValue(`version-${key}`)}`,
        },
        name: `${getFieldValue(`version-${key}`)}`,
      }
      subAry.push(query)
    })
    return subAry
  }

  handleSubmit = () => {
    const { componentList } = this.state
    const isAdd = this.props.location.search.split('=')[1]
    const { form, clusterID, namespace, AddComponent, editComponent } = this.props
    form.validateFields((err, value) => {
      if (err) {
        return
      }
      const query = {
        apiVersion: 'networking.istio.io/v1alpha3',
        kind: 'DestinationRule',
        metadata: {
          annotations: this.filterServiceName(value.description),
          name: value.componentName,
          resourceVersion: isAdd === 'false' ? componentList.metadata.resourceVersion : '',
        },
        spec: {
          host: value.componentName,
          subsets: this.filterSubsets(),
          trafficPolicy: {
            tls: {
              mode: 'ISTIO_MUTUAL',
            },
          },
        },
      }
      if (isAdd === 'true') {
        AddComponent(clusterID, query, namespace, { isHandleError: true }).then(res => {
          if (res.error) {
            if (res.status === 400) {
              notification.warn({
                message: '请至少关联一个后端服务',
              })
              return
            }
            if (res.status === 409) {
              notification.warn({
                message: `${value.componentName} 已经存在`,
              })
              return
            }
            notification.error({
              message: '添加组件失败',
            })
            return
          }
          notification.success({
            message: '添加组件成功',
          })
          this.props.history.push('/service-mesh/component-management')
        })
      } else {
        editComponent(clusterID, query, namespace, { isHandleError: true }).then(res => {
          if (res.error) {
            if (res.status === 400) {
              notification.warn({
                message: '请至少关联一个后端服务',
              })
              return
            }
            notification.error({
              message: '修改组件失败',
            })
            return
          }
          notification.success({
            message: '修改组件成功',
          })
          this.props.history.push('/service-mesh/component-management')
        })
      }
    })
  }

  filterService = list => {
    if (list.length !== 0) {
      const serviceAry = []
      Object.keys(list.metadata.annotations).forEach(item => {
        const query = {
          name: item,
          version: list.metadata.annotations[item],
        }
        serviceAry.push(query)
      })
      return serviceAry
    }
  }

  nameCheck = (rules, value, cb) => {
    if (!value) {
      return cb()
    }
    if (!/^[a-z][a-z0-9\-]{1,15}[a-z0-9]$/.test(value)) {
      return cb(APP_NAME_REG_NOTICE)
    }
    cb()
  }

  versionCheck = (rules, value, cb) => {
    if (!value) {
      return cb()
    }
    if (!/^[a-zA-Z0-9_\-\*]{1,46}$/.test(value)) {
      return cb('支持1-46个字符，可以字母、数字、中划线组成，字母或数字开头和结尾')
    }
    cb()
  }

  filterServicelist = key => {
    const { moduleServiceList } = this.state
    if (moduleServiceList) {
      if (moduleServiceList.indexOf(key) !== -1) {
        return true
      }
    }

    return false
  }

  validateToNextService = (rule, value, callback) => {
    const form = this.props.form
    const serviceKey = rule.field
    const keys = form.getFieldValue('keys')
    if (value) {
      keys.forEach(key => {
        const service = form.getFieldValue(`serviceName-${key}`)
        const serviceState = this.state[`service${key}`]
        if (!serviceState) {
          if (this.filterServicelist(service)) {
            callback('服务名称重复')
          }
          if (serviceKey !== `serviceName-${key}`) {
            if (value === service || this.filterServicelist(service)) {
              callback('服务名称重复')
            }
          }
        }
      })
    }
    callback()
  }

  render() {
    const { isAdd, componentList } = this.state
    const { form, serviceList } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 13 },
    }
    const serviceLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
    }
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const serviceLists = keys.length > 0 ? keys.map(key => {
      return (
        <Row className="serviceList" key={key}>
          <Col span={8} className="service">
            <FormItem
              {...serviceLayout}
            >
              {getFieldDecorator(`serviceName-${key}`, {
                rules: [{
                  validator: this.validateToNextService,
                }],
              })(
                <Select
                  placeholder="请选择服务"
                  style={{ width: '250%' }}
                  disabled={this.state[`service${key}`]}>
                  {
                    serviceList && Object.keys(serviceList).map((item, index) => {
                      if (serviceList[item].istioEnabled === true) {
                        return <Option key={index} value={`${Object.keys(serviceList)[index]}`}>
                          {Object.keys(serviceList)[index]}</Option>
                      }
                      return null
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
            >
              {getFieldDecorator(`version-${key}`, {
                rules: [{
                  validator: this.versionCheck,
                }],
              }
              )(
                <Input
                  placeholder="如：v1, abc"
                  disabled={this.state[`service${key}`]}
                  style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <Button
              type="dashed"
              className="delete"
              // icon="delete"
              // disabled={this.state[`service${key}`]}
              onClick={() => this.handleRemove(key)}><Icon type="delete" /></Button>
          </Col>
        </Row>
      )
    }) :
      <Row className="serviceList hintColor noneService" type="flex" align="middle" justify="center">
        暂无服务
      </Row>

    return (
      <QueueAnim className="create-component">
        <div className="create-component-btn layout-content-btns" keys="btn">
          <div className="back">
            <span className="backjia"></span>
            <span className="btn-back" onClick={() =>
              this.props.history.push('/service-mesh/component-management')
            }>返回组件管理列表</span>
          </div>
          <span className="title">{isAdd ? '创建组件' : '编辑组件'}</span>
        </div>
        <Card>
          <div className="create-component-top">
            <div className="create-component-body">
              <div>
                <Row>
                  <FormItem {...formItemLayout} label="组件名">
                    {getFieldDecorator('componentName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入组件名称',
                        }, {
                          validator: this.nameCheck,
                        }],
                      initialValue: componentList.length !== 0 ?
                        componentList.metadata.name : undefined,
                    })(
                      <Input className="selects" placeholder="请输入组件名称" disabled={!isAdd} />
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem {...formItemLayout} label="描述">
                    {getFieldDecorator('description', {
                      initialValue: componentList.length !== 0 ?
                        componentList.metadata.annotations.description : undefined,
                      rules: [{ pattern: '', whitespace: true, message: '' }],
                    })(
                      <TextArea className="area" rows={4} placeholder="请输入描述" />
                    )}
                  </FormItem>
                </Row>
                <div className="dotted"><span>关联服务</span></div>
              </div>
              <div>
                <div className="form-title">
                  <Row>
                    <span className="service">选择服务</span>
                    <Button type="primary" ghost onClick={() => this.handleAdd()}><Icon type="link" />关联后端服务</Button>
                    <span className="service-desc">
                      <Icon type="info-circle-o" />
                      解除关联后端服务后，路由规则中相应的版本也将被移除，服务的对外访问方式将失效
                    </span>
                  </Row>
                  <Row className="serviceHeader">
                    <Col span={9}>服务</Col>
                    <Col span={9}>组件服务版本</Col>
                    <Col span={6}>操作</Col>
                  </Row>
                  {serviceLists}
                  <p className="service-desc tip">Tips：组件创建后系统将重启该组件关联服务的所有实例。</p>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-bottom">
            <Button className="cancel" onClick={
              () => this.props.history.push('/service-mesh/component-management')}>取消</Button>
            <Button type="primary" onClick={() => this.handleSubmit()}>确定</Button>
          </div>
        </Card>
        <div className="bottom-soild"></div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, serviceMesh } = state
  const { config } = current
  const { cluster, project } = config
  const namespace = project.namespace
  const clusterID = cluster.id
  const { componentServiceList } = serviceMesh
  const serviceList = componentServiceList && componentServiceList.data || []
  return {
    clusterID,
    namespace,
    serviceList,
  }
}

export default connect(mapStateToProps, {
  AddComponent,
  loadComponent,
  editComponent,
  fetchComponent,
  fetchServiceList,
})(Form.create()(CreateComponent))
