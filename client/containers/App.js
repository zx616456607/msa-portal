/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * App container
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { resetErrorMessage } from '../actions'
import Header from '../components/Header'
import Sider from '../components/Sider'

const { Content, Footer } = Layout

class App extends React.Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
    routes: PropTypes.node.isRequired,
  }

  handleDismissClick = e => {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children, routes } = this.props
    console.log('location', this.props.location)
    return (
      <Layout>
        {this.renderErrorMessage()}
        <Header />
        <Sider />
        <Content className="layout-content">
          <main style={{ background: '#fff', padding: 24, minHeight: 520 }}>
            {children}
            {routes}
          </main>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Tenxcloud ©2017 Created by Tenxcloud UED
        </Footer>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  errorMessage: state.errorMessage,
})

export default connect(mapStateToProps, {
  resetErrorMessage,
})(App)
