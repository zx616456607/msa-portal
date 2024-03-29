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
import { Button, Input, Card, Form, Row, Col, Icon, Select, Tooltip, notification } from 'antd'
import './style/index.less'
import { COMPONENT_NAME, COMPONENT_NAME_REG } from '../../../../constants'
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

  componentDidMount() {
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
      const { annotations } = componentList.metadata
      if (subsets) {
        subsets.forEach((item, index) => {
          keys.push(uuid++)
          const key = annotations.description ? index + 1 : index
          Object.assign(obj, {
            [`serviceName-${index}`]: Object.keys(annotations)[key].split('/')[1],
            [`version-${index}`]: item.name,
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
        })
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
        const moduleValue = list[item].metadata.labels['system/servicemesh-module']
        if (moduleValue) {
          const query = {
            moduleName: moduleValue,
            service: item,
          }
          aryList.push(query)
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
          'system/servicemesh-version': `${getFieldValue(`version-${key}`)}`,
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
                message: `${value.componentName}已经存在, 组件名不能使用已存在的服务名`,
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
    if (!COMPONENT_NAME_REG.test(value)) {
      return cb(COMPONENT_NAME)
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
    let query
    if (moduleServiceList) {
      const filterList = moduleServiceList.filter(item => item.service === key)[0]
      if (filterList) {
        if (filterList.service === key) {
          query = Object.assign({}, query, { isTrue: true, componentName: filterList.moduleName })
          return query
        }
      }
      query = Object.assign({}, query, { isTrue: false })
      return query
    }
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
          const { isTrue, componentName } = this.filterServicelist(service)
          if (isTrue) {
            callback(`该服务已被${componentName}组件关联`)
          } else {
            if (serviceKey !== `serviceName-${key}`) {
              if (value === service || isTrue) {
                callback(`该服务已被${componentName}组件关联`)
              }
            }
          }
        }
      })
    }
    callback()
  }

  filterService = () => {
    const service = []
    const { componentList } = this.state
    const { annotations } = componentList.metadata
    if (annotations) {
      const serviceList = []
      Object.keys(annotations).forEach(item => {
        if (item.indexOf('svcName/') !== -1) {
          serviceList.push(item.split('/')[1])
        }
      })
      const services_component = annotations &&
        JSON.parse(annotations['system/services-in-component'])
      serviceList.forEach(keys => {
        if (services_component.indexOf(keys) === -1) {
          service.push(keys)
        }
      })
    }
    return service
  }

  tipService = name => {
    const listAry = this.filterService()
    const { form } = this.props
    const showName = form.getFieldValue(name)
    return listAry.length && listAry.indexOf(showName) > -1 ?
      <Tooltip placement="top"
        title={`组件中的 ${showName} 服务已经不存在，请编辑移除该服务`}>
        <Icon type="exclamation-circle" className="ico" />
      </Tooltip> : ''
  }

  render() {
    const { isAdd, componentList } = this.state
    const { form, serviceList } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 13 },
    }
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const { metadata } = componentList
    const serviceLists = keys.length > 0 ? keys.map(key => {
      return (
        <Row className="serviceList" key={key}>
          <Col span={8} className="service">
            <FormItem
            >
              {getFieldDecorator(`serviceName-${key}`, {
                rules: [{ required: true, message: '请选择一个服务' }, {
                  validator: this.validateToNextService,
                }],
              })(
                <Select
                  placeholder="请选择服务"
                  style={{ width: '100%' }}
                  disabled={false && this.state[`service${key}`]}>
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
          <Col span={9}>
            <FormItem
            >
              {getFieldDecorator(`version-${key}`, {
                rules: [{ required: true, message: '服务版本不能为空' }, {
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
              onClick={() => this.handleRemove(key)}>
              <Icon type="delete" />
            </Button>
            {this.state[`service${key}`] ? this.tipService(`serviceName-${key}`) : ''}
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
                      initialValue: metadata && metadata.name,
                    })(
                      <Input className="selects" placeholder="请输入组件名称" disabled={!isAdd} />
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem {...formItemLayout} label="描述">
                    {getFieldDecorator('description', {
                      initialValue: metadata && metadata.annotations &&
                        metadata.annotations.description,
                      rules: [{ pattern: '', whitespace: true, message: '' }],
                    })(
                      <TextArea className="area" rows={4} placeholder="请输入描述" />
                    )}
                  </FormItem>
                </Row>
                <div className="dotted">
                  <div className="lineService">
                    <Row><Col span={2} className="ServiceName"><span>关联服务</span></Col></Row>
                  </div>
                  <span className="line"></span>
                </div>
              </div>
              <FormItem {...formItemLayout} label="选择服务">
                <Button type="primary" ghost onClick={() => this.handleAdd()}><Icon type="link" />关联后端服务</Button>
              </FormItem>
              <Row>
                <Col span={2}></Col>
                <Col span={22}>
                  <span className="service-desc">
                    <Icon type="info-circle-o" />
                      解除关联后端服务后，路由规则中相应的版本也将被移除，服务的对外访问方式将失效
                  </span>
                  <Row className="serviceHeader">
                    <Col span={8}>服务</Col>
                    <Col span={9}>组件服务版本</Col>
                    <Col span={6}>操作</Col>
                  </Row>
                  {serviceLists}
                  <p className="service-desc tip">Tips：组件创建后系统将重启该组件关联服务的所有实例。</p>
                </Col>
              </Row>
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
