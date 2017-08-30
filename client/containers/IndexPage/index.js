/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * IndexPage container
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd'
import Sider from '../../components/Sider'
import { loadApms } from '../../actions/apm'

const { Content } = Layout

class IndexPage extends React.Component {
  test = a => <h2>{a}</h2>

  componentWillMount() {
  }

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
            <Menu.Item key="7">
              <Icon type="team" />
              <span className="nav-text">nav 7</span>
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="shop" />
              <span className="nav-text">nav 8</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="layout-content">
          <h1>IndexPage</h1>
          {this.test('arrow function')}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  errorMessage: state.errorMessage,
  auth: state.entities.auth,
})

export default connect(mapStateToProps, {
  loadApms,
})(IndexPage)
