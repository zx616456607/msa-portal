/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 */

/**
 * api group detail
 *
 * 2019-03-05
 * @author rensiwei
 */

import React from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import AUTH_ZONE_ICON from '../../../assets/img/msa-manage/auth-zone.png'
import { parse as parseQuerystring } from 'query-string'
import { Icon, Card, Row, Col, Tabs, Modal, Form, Input, notification } from 'antd'
import { getGatewayApiGroup, updateGatewayApiGroup } from '../../../actions/gateway'
import ServiceList from './ServiceList'
import ApiList from '../../ApiGateWay/ApiManage'
import './style/index.less'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'
import { formatDate } from '../../../common/utils'
import cloneDeep from 'lodash/cloneDeep'

const TabPane = Tabs.TabPane

class APIGroupDetail extends React.Component {
  state = {
    apiDetail: {},
    isShowDescModal: false,
  }
  componentDidMount() {
    this.loadData()
  }
  loadData = () => {
    const { getGatewayApiGroup, clusterID, apiGroupId } = this.props
    getGatewayApiGroup(clusterID, apiGroupId).then(res => {
      const result = getDeepValue(res, [ 'response', 'result' ]) || {}
      if (result.code === 200) {
        this.setState({
          apiDetail: result.data,
        })
      }
    })
  }
  onDescOk = () => {
    const { form: { validateFields }, apiGroupId, clusterID, updateGatewayApiGroup } = this.props
    validateFields((err, values) => {
      if (err) return
      updateGatewayApiGroup(clusterID, apiGroupId, values).then(res => {
        const result = getDeepValue(res, [ 'response', 'result' ]) || {}
        if (result.code === 200) {
          const { apiDetail } = this.state
          const temp = cloneDeep(apiDetail)
          this.setState({
            isShowDescModal: false,
            apiDetail: Object.assign(temp, values),
          })
          notification.success({
            message: '修改成功',
          })
        } else {
          notification.warn({
            message: '修改失败',
          })
        }
      })
    })
  }
  render() {
    const { location, apiGroupId } = this.props
    const { apiDetail, isShowDescModal } = this.state
    const { protocol, createTime, description, path,
      name, proxyType, apis } = apiDetail
    return <QueueAnim className="detail-wrapper">
      <div className="detail-top layout-content-btns" keys="btn">
        <div className="back">
          <span className="backjia"></span>
          <span className="btn-back" onClick={() =>
            this.props.history.push('/api-group/list')
          }>返回</span>
        </div>
        <span className="title">API 组详情</span>
      </div>
      <Card>
        <div className="header-detail">
          <img src={AUTH_ZONE_ICON} className="api-group-detail-icon" alt="api-group-detail-icon"/>
          <div className="api-group-detail-info">
            <div className="api-group-detail-name">API 组名称: {name}</div>
            <Row className="detail-row">
              <Col span={8}>访问协议：{protocol || '-'}</Col>
              <Col span={8}>创建时间：{createTime ? formatDate(createTime, 'YYYY-MM-DD HH-mm-ss') : '-'}</Col>
              <Col span={8}>描述：{description || '-'} <Icon onClick={() => this.setState({ isShowDescModal: true })} className="edit_desc" type="edit" /></Col>
            </Row>
            <Row className="detail-row">
              <Col span={8}>URL 前缀：{path || '-'}</Col>
              <Col span={8}>后端服务源：{proxyType === 0 ? '代理' : '负载均衡'}</Col>
            </Row>
          </div>
        </div>
      </Card>
      <Card className="api-detail-list">
        <Tabs defaultActiveKey="api_list">
          <TabPane tab="API 列表" key="api_list">
            <ApiList apiGroupId={Number(apiGroupId)} apis={apis} />
          </TabPane>
          <TabPane tab="后端服务" key="service_list">
            <ServiceList proxyType={proxyType} apiGroupId={apiGroupId} location={location} />
          </TabPane>
        </Tabs>
      </Card>
      {
        isShowDescModal ?
          <Modal
            visible={isShowDescModal}
            onCancel={() => this.setState({ isShowDescModal: false })}
            onOk={this.onDescOk}
            title="更新描述"
          >
            <Form>
              <Form.Item
                label="描述"
                {...{
                  labelCol: { span: 4 },
                  wrapperCol: { span: 10 },
                }}
              >
                {
                  this.props.form.getFieldDecorator('description', {
                    initialValue: description || '',
                    rules: [{ required: true, message: '请输入描述' }],
                  })(
                    <Input placeholder="请输入描述" />
                  )
                }
              </Form.Item>
            </Form>
          </Modal>
          :
          null
      }
    </QueueAnim>
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current } = state
  const currentUser = current.user.info
  const { cluster } = current.config
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  const { match } = ownProps
  const { apiGroupId } = match.params
  return {
    clusterID: cluster.id,
    apiGroupId,
    currentUser,
    location,
  }
}

export default connect(mapStateToProps, {
  getGatewayApiGroup,
  updateGatewayApiGroup,
})(Form.create()(APIGroupDetail))
