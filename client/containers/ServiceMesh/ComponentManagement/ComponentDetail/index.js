/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CallLinkTracking container
 *
 * 2018-10-08
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Card, Form, Row, Col, Tabs, Button, Table, Modal, Select, Input, Icon, Tooltip, notification } from 'antd'
import { formatDate } from '../../../../common/utils'
import componentImg from '../../../../assets/img/serviceMesh/component.png'
import { fetchComponent, editComponent, fetchServiceList, deleteComponent } from '../../../../actions/serviceMesh'
import './style/index.less'
import confirm from '../../../../components/Modal/confirm'
import { ServiceAddressTip } from '../AddressTip'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
let uuid = 1
class ComponentDetail extends React.Component {
  state = {
    delList: [],
    detailList: [],
    serviceList: [],
    isAdd: false,
    visible: false,
    isLoading: true,
    delVisible: false,
  }

  componentDidMount() {
    this.loadDetail()
  }

  loadDetail = () => {
    const c_name = this.props.location.search.split('=')[1]
    const { clusterID, namespace, fetchComponent, fetchServiceList } = this.props
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
        serviceList: aryList,
      })
    })
    const query = {
      name: c_name,
      project: namespace,
    }
    fetchComponent(clusterID, query).then(res => {
      if (res.error) {
        return
      }
      this.setState({
        isLoading: false,
        detailList: res.response.result,
      })
    })
  }

  handleRefresh = () => {
    this.setState({
      isLoading: true,
    })
    this.loadDetail()
  }

  filterService = list => {
    if (list.length !== 0) {
      const serviceAry = []
      const { annotations } = list.metadata
      list.spec.subsets && list.spec.subsets.forEach((item, index) => {
        const key = annotations.description ? index + 1 : index
        const query = {
          name: Object.keys(annotations)[key].split('/')[1],
          'system/servicemesh-version': item.labels['system/servicemesh-version'],
        }
        serviceAry.push(query)
      })
      return serviceAry
    }
  }

  handleClose = () => {
    const { form } = this.props
    const { setFieldsValue } = form
    this.setState({
      visible: false,
    })
    setFieldsValue({ keys: [ 0 ] })
  }

  handleDelete = list => {
    const { detailList } = this.state
    this.setState({
      isAdd: false,
    })
    const specFlag = !!(detailList && detailList.spec.subsets.length <= 1)
    const tip = detailList && specFlag ? '组件中唯一服务移除后，组件也将被移除' : ''
    confirm({
      modalTitle: '移除服务',
      title: '移除后该服务所关联的路由规则将不再生效，是否确定移除该后端服务',
      content: tip,
      onOk: () => {
        if (list) {
          this.handleService(list)
          // if (specFlag) {
          //   if (metadata && metadata.name) {
          //     deleteComponent(clusterID, metadata.name).then(res => {
          //       if (res.error) {
          //         notification.success({
          //           message: `移除组件 ${metadata.name} 失败`,
          //         })
          //         return
          //       }
          //       notification.success({
          //         message: `移除组件 ${metadata.name} 成功`,
          //       })
          //       this.props.history.push('/service-mesh/component-management')
          //     })
          //   }
          // } else {
          //   this.handleService(list)
          // }
        }
      },
    })
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

  handleService = list => {
    const { form, clusterID, namespace, editComponent } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { isAdd, detailList } = this.state
    const keys = getFieldValue('keys')
    form.validateFields(err => {
      if (err) {
        notification.warn({
          message: '服务名称重复',
        })
        return
      }
      if (isAdd) {
        keys.forEach(key => {
          const nameKey = `svcName/${getFieldValue(`serviceName-${key}`)}`
          const value = `${getFieldValue(`version-${key}`)}`
          const queryAnnotations = {
            [nameKey]: value,
          }
          const querySubsets = {
            labels: {
              'system/servicemesh-version': value,
            },
            name: value,
          }
          detailList.metadata.annotations = queryAnnotations
          detailList.spec.subsets.push(querySubsets)
        })
      } else {
        const { name } = list
        const version = list['system/servicemesh-version']
        if (name && version) {
          const annotations = detailList.metadata.annotations
          annotations && Object.keys(annotations).forEach(item => {
            const serviceName = item.split('/')[1]
            if (serviceName === name) {
              delete detailList.metadata.annotations[item]
            }
          })
          detailList && detailList.spec.subsets.forEach((item, index) => {
            const key = item.labels['system/servicemesh-version']
            if (key === version) {
              detailList.spec.subsets.splice(index, 1)
            }
          })
        }
      }
      editComponent(clusterID, detailList, namespace).then(res => {
        if (res.error) {
          return
        }
        this.setState({
          visible: false,
          isLoading: false,
        })
        this.loadDetail()
      })
      setFieldsValue({ keys: [] })
    })
  }

  handleAdd = () => {
    this.setState({
      isAdd: true,
      visible: true,
    })
  }

  componentAdd = () => {
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
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  handleDelClose = () => {
    this.setState({
      isLoading: false,
      delVisible: false,
    })
  }

  handleDelService = () => {
    const { delList } = this.state
    if (delList) {
      this.handleService(delList)
    }
  }

  filterServicelist = key => {
    const { serviceList } = this.state
    let query
    if (serviceList) {
      const filterList = serviceList.filter(item => item.service === key)[0]
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
        const { isTrue, componentName } = this.filterServicelist(service)
        if (isTrue) {
          callback(`该服务已被${componentName}组件关联`)
        }
        if (serviceKey !== `serviceName-${key}`) {
          if (value === service || isTrue) {
            callback(`该服务已被${componentName}组件关联`)
          }
        }
      })
    }
    callback()
  }

  filterServices = record => {
    const service = []
    if (record) {
      const serviceList = []
      record.metadata.annotations && Object.keys(record.metadata.annotations).forEach(key => {
        if (key.indexOf('svcName/') !== -1) {
          serviceList.push(key.split('/')[1])
        }
      })
      const services_component = record.metadata.annotations['system/services-in-component'] &&
        JSON.parse(record.metadata.annotations['system/services-in-component'])
      if (services_component) {
        serviceList.forEach(keys => {
          if (services_component.indexOf(keys) === -1) {
            service.push(keys)
          }
        })
      }
    }
    return service
  }

  tipService = list => {
    const listAry = this.filterServices(list)
    return listAry.length ?
      <Tooltip placement="top"
        title={`组件中的 “${listAry}” 服务已经不存在，请编辑移除该服务`}>
        <Icon type="exclamation-circle" className="ico" />
      </Tooltip> : ''
  }

  render() {
    const { form, serviceList } = this.props
    const { detailList, isLoading } = this.state
    const columns = [{
      id: 'id',
      title: '服务名称',
      width: '15%',
      dataIndex: 'name',
    }, {
      title: '组件服务版本',
      dataIndex: 'system/servicemesh-version',
    }, {
      title: '服务地址',
      dataIndex: 'address',
      render: (text, record) => {
        const serviceName = record.name
        return <div className="AddressTipWrape">
          <ServiceAddressTip dataList={[ serviceName ]}
            parentNode={'AddressTipWrape'} /></div>
      },
    }, {
      title: '路由规则',
      width: '25%',
      dataIndex: 'router',
      render: () => <span>--</span>,
    }, {
      title: '操作',
      render: record => <div>
        <Button onClick={() => this.handleDelete(record)}>移除</Button>
        {this.tipService(detailList)}
      </div>,
    }]
    const { metadata } = detailList
    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('keys', { initialValue: [ 0 ] })
    const keys = getFieldValue('keys')
    const serviceLists = keys.map(key => {
      return (
        <Row className="serviceList" key={key}>
          <Col span={10}>
            <FormItem
            >
              {getFieldDecorator(`serviceName-${key}`, {
                initialValue: undefined,
                rules: [{
                  validator: this.validateToNextService,
                }],
              })(
                <Select placeholder="请选择服务" style={{ width: 180 }}>
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
          <Col span={10}>
            <FormItem>
              {getFieldDecorator(`version-${key}`, {
                initialValue: undefined,
              })(
                <Input placeholder="如：1.0.0" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <Button type="dashed" icon="delete" onClick={() => this.handleRemove(key)}></Button>
          </Col>
        </Row>
      )
    })
    return (
      <QueueAnim className="component-detail">
        <div className="component-detail-title layout-content-btns" keys="btn">
          <div className="back">
            <span className="backjia"></span>
            <span className="btn-back" onClick={() =>
              this.props.history.push('/service-mesh/component-management')
            }>返回组件管理列表</span>
          </div>
          <span className="title">组件详情</span>
        </div>
        <Card className="component-detail-top" key="desc">
          <div className="topLeft">
            <div className="imgs">
              <img src={componentImg} />
            </div>
            <div className="desc">
              <h2>组件名称：{metadata && metadata.name}</h2>
              <div className="descs">
                <div>创建时间：{formatDate(metadata && metadata.creationTimestamp)}</div>
                <div>描述：{metadata && metadata.annotations && metadata.annotations.description}</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="component-detail-body">
          <Tabs defaultActiveKey="1">
            <TabPane tab="关联服务" key="1">
              <div>
                <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                  关联后端服务
                </Button>
                <Button className="sync" icon="sync" onClick={() => this.handleRefresh()}>
                  刷新
                </Button>
              </div>
              <Table
                pagination={false}
                loading={isLoading}
                dataSource={this.filterService(detailList)}
                columns={columns}
                rowKey={row => row.id} />
            </TabPane>
          </Tabs>
        </Card>
        <Modal title="关联后端服务"
          visible={this.state.visible}
          onCancel={this.handleClose}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleClose}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleService}>确 定</Button>,
          ]}>
          <Row className="serviceHeader">
            <Col span={10}>服务名称</Col>
            <Col span={9}>组件服务版本</Col>
            <Col span={3}></Col>
          </Row>
          {serviceLists}
          <span onClick={() => this.componentAdd()}>
            <Icon type="plus-circle-o" theme="outlined" className="ico" />
            添加一个服务
          </span>
        </Modal>
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
  editComponent,
  fetchComponent,
  deleteComponent,
  fetchServiceList,
})(Form.create()(ComponentDetail))

