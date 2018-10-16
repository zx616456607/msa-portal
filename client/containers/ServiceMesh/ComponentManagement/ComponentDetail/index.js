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
import { Card, Form, Row, Col, Tabs, Button, Table, Modal, Select, Input, Icon } from 'antd'
import { formatDate } from '../../../../common/utils'
import componentImg from '../../../../assets/img/serviceMesh/component.png'
import { fetchComponent, editComponent, fetchServiceList } from '../../../../actions/serviceMesh'
import './style/index.less'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
let uuid = 1
class ComponentDetail extends React.Component {
  state = {
    isAdd: false,
    visible: false,
    detailList: [],
    isLoading: true,
  }

  componentDidMount() {
    this.loadDetail()
  }

  loadDetail = () => {
    const c_name = this.props.location.search.split('=')[1]
    const { clusterID, fetchComponent, fetchServiceList } = this.props
    fetchServiceList(clusterID, 'kaifacloud')
    const query = {
      name: c_name,
      project: 'kaifacloud',
    }
    fetchComponent(clusterID, query).then(res => {
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

  handleClose = () => {
    this.setState({
      visible: false,
    })
  }

  handleDelete = list => {
    this.setState({
      isAdd: false,
    }, () => {
      this.handleService(list)
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
    const { clusterID, editComponent } = this.props
    const { isAdd, detailList } = this.state
    const { form } = this.props
    const { getFieldValue } = form
    const keys = getFieldValue('keys')
    if (isAdd) {
      keys.forEach(key => {
        const nameKey = `svcName/${getFieldValue(`serviceName-${key}`)}`
        const value = `${getFieldValue(`version-${key}`)}`
        detailList.metadata.annotations[`${nameKey}`] = value
        const query = {
          labels: {
            version: value,
          },
          name: value,
        }
        detailList.spec.subsets.push(query)
      })
    } else {
      const { name, version } = list
      Object.keys(detailList.metadata.annotations).forEach(item => {
        if (item === name) {
          delete detailList.metadata.annotations[item]
        }
      })
      Object.keys(detailList.spec.subsets).forEach(item => {
        const key = detailList.spec.subsets[item].name
        if (key === version) {
          detailList.spec.subsets.splice(item, 1)
        }
      })
    }
    editComponent(clusterID, detailList, 'kaifacloud').then(res => {
      if (res.error) {
        return
      }
      this.loadDetail()
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
      dataIndex: 'version',
    }, {
      title: '路由规则',
      width: '25%',
      dataIndex: '',
    }, {
      title: '操作',
      render: record => <div>
        <Button onClick={() => this.handleDelete(record)}>删除</Button>
      </div>,
    }]
    const { metadata } = detailList
    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('keys', { initialValue: [ 0 ] })
    const keys = getFieldValue('keys')
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
    }
    const serviceLists = keys.map((res, index) => {
      return (
        <Row className="serviceList" key={index}>
          <Col span={9}>
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
          <Col span={10}>
            <FormItem>
              {getFieldDecorator(`version-${index}`, {
                initialValue: undefined,
              })(
                <Input placeholder="如：1.0.0" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <Button type="dashed" icon="delete" onClick={() => this.handleRemove(index)}></Button>
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
          <div className="title">组件详情</div>
        </div>
        <Card className="component-detail-top" key="desc">
          <div className="topLeft">
            <div className="imgs">
              <img src={componentImg} />
            </div>
            <div className="desc">
              <h2>实例名称：{metadata && metadata.name}</h2>
              <div className="descs">
                <div>创建时间：{formatDate(metadata && metadata.creationTimestamp)}</div>
                <div>描述：</div>
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
            <Col span={9}>服务名称</Col>
            <Col span={10}>组件服务版本</Col>
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
  editComponent,
  fetchComponent,
  fetchServiceList,
})(Form.create()(ComponentDetail))

