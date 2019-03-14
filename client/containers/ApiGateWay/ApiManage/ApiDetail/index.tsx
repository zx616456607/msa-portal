/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * page ApiDetail
 *
 * @author ZhouHaitao
 * @date 2019-03-06 10:42
 */

import * as React from 'react'
import { Card, Tabs, Button, Icon, Input, Row, Col, notification } from 'antd'
import ReturnButton from '@tenx-ui/return-button'
import ReleaseHistory from './ReleaseHistory'
import Debug from './Debug'
import * as apiManageAction from '../../../../actions/apiManage'
import './style/apiDetail.less'
import { connect } from 'react-redux';
import apiIcon from '../../../../assets/img/apiGateway/apiIcon.png'
import * as apiGroupAction from '../../../../actions/gateway';
import { formatDate } from '../../../../common/utils'

const { TextArea } = Input
const TabPane = Tabs.TabPane
interface ComponentProps {
}
interface StateProps {
  clusterID: string
}
interface DispatchProps {
  getApiDetail(clusterID: string, id: string): any
  updateApi(clusterID: string, id: string, body: object): any
}
type ApiDetailProps = StateProps & DispatchProps & ComponentProps

class ApiDetail extends React.Component<ApiDetailProps> {
  state = {
    edit: false,
    description: false,
    apiData: {
      apiGroup: { name: '' },
    },
    desText: '',
  }
  componentDidMount() {
    this.onLoadApiData()
  }
  onLoadApiData = async () => {
    const { clusterID, getApiDetail } = this.props
    const { id } = this.props.match.params
    const res = await getApiDetail(clusterID, id)
    if (!res.error) {
      this.setState({
        apiData: res.response.result.data,
      }, () => {
        if (this.state.apiData.description) {
          this.setState({
            description: true,
            desText: this.state.apiData.description,
          })
        }
      })
    }
  }
  onEdit = () => this.setState({
    edit: !this.state.edit,
    description: true,
  })
  onEditCancel = () => this.setState({
    edit: !this.state.edit,
    description: this.state.apiData.description ? true : false,
    desText: this.state.apiData.description,
  })
  onDescriptionChange = e => {
    this.setState({
      desText: e.target.value,
    })
  }
  onReturn = () => this.props.history.push('/api-gateway')
  onEditSubmit = async () => {
    const { clusterID, updateApi } = this.props
    const { id } = this.props.match.params
    const { apiData } = this.state
    const res = await updateApi(clusterID, id, { apiData })
    if (!res.error) {
      this.onLoadApiData()
      notification.success({
        message: '更新描述成功',
        description: '',
      })
    }
    this.setState({
      edit: !this.state.edit,
    })
  }
  render() {
    const { edit, description, apiData, desText } = this.state
    const { id, activeTab } = this.props.match.params
    return <div className="api-detail">
      <div className="top">
        <ReturnButton onClick={this.onReturn}>返回</ReturnButton>
        <span>API 详情页面</span>
      </div>
      <Card
        hoverable
        className="header"
      >
        <Row>
          <Col span={2}>
            <img src={apiIcon} className="img"/>
          </Col>
          <Col span={22}>
            <h2>{apiData && apiData.name}</h2>
            <Row>
              <Col span={8}>
                <p>所属API组：{apiData && apiData.apiGroup && apiData.apiGroup.name}</p>
                <p>协议：{apiData && apiData.protocols}</p>
                <p>请求方法：{apiData && apiData.methods}</p>
              </Col>
              <Col span={8}>
                <p>访问路径：{apiData && apiData.path}</p>
                <p>访问控制：{apiData && apiData.authType}</p>
                <p>创建：{formatDate(apiData && apiData.createTime)}</p>
              </Col>
              <Col span={8}>
                <div className="description">
                  描述：
                  <div>
                    <>
                      {!edit ?
                        <>可{description ? '编辑' : '添加'}描述
                          <Icon onClick={this.onEdit} type="edit" />
                        </>
                        :
                        <>
                          <Button onClick={this.onEditCancel}>取消</Button>
                          <Button type="primary" onClick={this.onEditSubmit}>确定</Button>
                        </>
                      }
                    </>
                  </div>
                </div>
                {description &&
                <TextArea
                  disabled={!edit}
                  defaultValue={apiData && apiData.description}
                  onChange={this.onDescriptionChange}
                />}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Card
        hoverable
      >
        <Tabs activeKey={activeTab === 'default' ? 'release-history' : 'debug-api'}>
          <TabPane tab="发布历史" key="release-history">
            <ReleaseHistory
              apiData={apiData}
            />
          </TabPane>
          <TabPane tab="调试API" key="debug-api">
            <Debug apiId={id}/>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  }
}

const mapStateToProps = (state: object): StateProps => {
  const { current: { config: { cluster: { clusterID } } } } = state
  return {
    clusterID,
  }
}
const mapDispatchToProps = {
  getApiDetail: apiManageAction.getApiDetail,
  updateApi: apiManageAction.updateApi,
}
export default connect<StateProps, DispatchProps, ComponentProps>
(mapStateToProps, mapDispatchToProps)(ApiDetail)
