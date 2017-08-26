/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * TestPage container
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import Sider from '../../components/Sider'
import RelationSchema from '../../components/RelationSchema'

const { Content } = Layout

export default class TestPage extends React.Component {
  render() {
    return (
      <Layout>
        <Sider>
          <Menu mode="inline" defaultSelectedKeys={[ '4' ]}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="bar-chart" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="cloud-o" />
              <span className="nav-text">nav 5</span>
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="appstore-o" />
              <span className="nav-text">nav 6</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="layout-content">
          <div>
            <h1>TestPage33</h1>
            <RelationSchema data={[]} width={200} height={200}/>
          </div>
        </Content>
      </Layout>
    )
  }
}
