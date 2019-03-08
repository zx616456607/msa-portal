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
import { Card, Tabs, Button, Icon, Input, Row, Col } from 'antd'
import ReturnButton from '@tenx-ui/return-button'
import ReleaseHistory from './ReleaseHistory'
import Debug from './Debug'
import './style/apiDetail.less'

const { TextArea } = Input
const TabPane = Tabs.TabPane

interface ApiDetailProps {

}
class ApiDetail extends React.Component<ApiDetailProps> {
  state = {
    edit: false,
    description: false,
  }
  onEdit = () => this.setState({
    edit: !this.state.edit,
    description: !this.state.description,
  })
  onReturn = () => this.props.history.push('/api-gateway')
  onEditSubmit = () => {
    this.setState({
      edit: !this.state.edit,
    })
  }
  render() {
    const { edit, description } = this.state
    const apiData = {
      name: 'API NAME',
      version: '201906032451',
    }
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
            <a className="img"/>
          </Col>
          <Col span={22}>
            <h2>{'API NAME'}</h2>
            <Row>
              <Col span={8}>
                <p>所属API组：{'fdasfsffe'}</p>
                <p>协议：{'HTTP'}</p>
                <p>请求方法：{'GET'}</p>
              </Col>
              <Col span={8}>
                <p>访问路径：{'/api'}</p>
                <p>访问控制：{'JWT'}</p>
                <p>创建：{'2019-11-20'}</p>
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
                          <Button onClick={this.onEdit}>取消</Button>
                          <Button type="primary" onClick={this.onEditSubmit}>确定</Button>
                        </>
                      }
                    </>
                  </div>
                </div>
                {
                  description && <TextArea disabled={!edit}/>}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Card
        hoverable
      >
        <Tabs defaultActiveKey="release-history">
          <TabPane tab="发布历史" key="release-history">
            <ReleaseHistory
              apiData={apiData}
            />
          </TabPane>
          <TabPane tab="调试API" key="debug-api">
            <Debug/>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  }
}

export default ApiDetail
