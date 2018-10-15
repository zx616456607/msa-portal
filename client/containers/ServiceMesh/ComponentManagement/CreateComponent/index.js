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
import { AddComponent, fetchServiceList, loadComponent, fetchComponent, editComponent } from '../../../../actions/serviceMesh'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
let uuid = 1

class CreateComponent extends React.Component {
  state = {
    isAdd: true,
    serviceAry: [],
    componentList: [],
  }

  componentDidMount() {
    const isAdd = this.props.location.search.split('=')[1]
    this.fetchServiceList()
    if (isAdd === 'false') {
      const componentName = this.props.location.pathname.split('/')[3]
      this.fetchList(componentName)
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
    const { clusterID, fetchComponent } = this.props
    const query = {
      name,
      project: 'kaifacloud',
    }
    fetchComponent(clusterID, query).then(res => {
      this.setState({
        componentList: res.response.result,
      })
    })
  }

  fetchServiceList = () => {
    const { clusterID, fetchServiceList } = this.props
    fetchServiceList(clusterID, 'kaifacloud')
  }

  handleBack = () => {
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

  filterServiceName = () => {
    const { form } = this.props
    const { getFieldValue } = form
    const keys = getFieldValue('keys')
    const query = {}
    keys.forEach(key => {
      query[`svcName/${getFieldValue(`serviceName-${key}`)}`] = `${getFieldValue(`version-${key}`)}`
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
    const { form, clusterID, AddComponent, editComponent } = this.props
    form.validateFields((err, value) => {
      if (err) {
        return
      }
      const query = {
        apiVersion: 'networking.istio.io/v1alpha3',
        kind: 'DestinationRule',
        metadata: {
          annotations: this.filterServiceName(),
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
        AddComponent(clusterID, query, 'kaifacloud').then(res => {
          if (res.error) {
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
        editComponent(clusterID, query, 'kaifacloud').then(res => {
          if (res.error) {
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
    }
  }

  nameCheck = (rules, value, cb) => {
    if (!value) {
      return cb()
    }
    if (!/^[a-z_\-\*]{1,15}$/.test(value)) {
      return cb('可由 1~ 15 位字母、数字、中划线组成，以字母开头，字母或者数字结尾')
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

  render() {
    const { isAdd, componentList } = this.state
    const { form, serviceList } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
    }
    getFieldDecorator('keys', { initialValue: [ 0 ] })
    const keys = getFieldValue('keys')
    // if (componentList.length !== 0) {
    //   this.filterService(componentList)
    // }
    const serviceLists = keys.map((res, index) => {
      return (
        <Row className="serviceList" key={index}>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator(`serviceName-${index}`, {
                initialValue: undefined,
              })(
                <Select placeholder="请选择服务" style={{ width: 120 }}>
                  {
                    serviceList && Object.keys(serviceList).map((item, index) => {
                      if (serviceList[item].istioEnabled === true) {
                        return <Option value={`${Object.keys(serviceList)[index]}`}>
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
            <FormItem>
              {getFieldDecorator(`version-${index}`, {
                rules: [{
                  // validator: this.versionCheck,
                }],
                initialValue: undefined,
              })(
                <Input placeholder="如：v1, abc" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <Button onClick={() => this.handleRemove(index)}>删除</Button>
          </Col>
        </Row>
      )
    })
    return (
      <QueueAnim className="create-component">
        <div className="create-component-btn layout-content-btns" keys="btn">
          <div className="back">
            <span className="backjia"></span>
            <span className="btn-back" onClick={() =>
              this.props.history.push('/service-mesh/component-management')
            }>返回</span>
          </div>
          <div className="title">{isAdd ? '添加组件' : '编辑组件'}</div>
        </div>
        <Card className="create-component-body">
          <div>
            <Row>
              <FormItem {...formItemLayout} label="组件名">
                {getFieldDecorator('componentName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入路由名称',
                    }, {
                      validator: this.nameCheck,
                    }],
                  initialValue: componentList.length !== 0 ?
                    componentList.metadata.name : undefined,
                })(
                  <Input className="selects" placeholder="" disabled={!isAdd} />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="描述">
                {getFieldDecorator('desc', {
                  initialValue: undefined,
                  rules: [{ pattern: '', whitespace: true, message: '' }],
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </Row>
            <div className="dotted" />
          </div>
          <div>
            <div className="form-title">
              <Row>
                <span className="service">选择服务</span>
                <Button onClick={() => this.handleAdd()}><Icon type="link" />关联后端服务</Button>
                <span className="service-desc">
                  <Icon type="info-circle-o" />
                  解除关联后端服务后，路由规则中相应的版本也将被移除，服务的对外访问方式将失效
                </span>
              </Row>
              <Row className="serviceHeader">
                <Col span={6}>服务</Col>
                <Col span={7}>组件服务版本</Col>
                <Col span={3} offset={1}>操作</Col>
              </Row>
              {serviceLists}
            </div>
            <div className="dotted" />
            <div className="btn-bottom">
              <Button className="cancel" onClick={
                () => this.props.history.push('/service-mesh/component-management')}>取消</Button>
              <Button type="primary" onClick={() => this.handleSubmit()}>确定</Button>
            </div>
          </div>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, serviceMesh } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  const { componentServiceList } = serviceMesh
  const serviceList = componentServiceList && componentServiceList.data || []
  return {
    clusterID,
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
