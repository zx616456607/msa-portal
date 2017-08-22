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
import { Route } from 'react-router-dom'
import { Layout, Spin, Modal, notification } from 'antd'
import { parse } from 'query-string'
import { resetErrorMessage } from '../actions'
import Header from '../components/Header'
import { getAuth, AUTH_FAILURE } from '../actions'
import { JWT } from '../constants'
import { childRoutes } from '../RoutesDom'

const { Footer } = Layout

class App extends React.Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
  }

  componentWillMount() {
    const { getAuth, location, history } = this.props
    const { username, token } = parse(location.search)
    getAuth({ username, token }).then(res => {
      if (res.type === AUTH_FAILURE) {
        Modal.error({
          title: '认证失败',
          content: '请您刷新页面重试或点击确定返回',
          closable: false,
          onOk: () => history.goBack(),
        })
        return
      }
      // Save jwt token to localStorage
      if (localStorage) {
        localStorage.setItem(JWT, res.response.entities.auth[JWT].token)
      }
    })
  }

  renderErrorMessage = () => {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    notification.error({
      message: errorMessage,
    })
  }

  render() {
    const { children, auth } = this.props
    const jwt = auth[JWT] || {}
    if (!jwt.token) {
      return (
        <div className="loading">
          <Spin size="large" />
        </div>
      )
    }
    return (
      <Layout>
        {this.renderErrorMessage()}
        <Header />
        { children }
        {
          childRoutes.map(routeProps => <Route {...routeProps} />)
        }
        <Footer style={{ textAlign: 'center' }}>
          Tenxcloud ©2017 Created by Tenxcloud UED
        </Footer>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  errorMessage: state.errorMessage,
  auth: state.entities.auth,
})

export default connect(mapStateToProps, {
  resetErrorMessage,
  getAuth,
})(App)
