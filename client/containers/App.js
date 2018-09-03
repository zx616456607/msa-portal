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
import ClassNames from 'classnames'
import { Layout, Modal, notification, message as messageTip } from 'antd'
import { parse } from 'query-string'
import Header from '../components/Header'
import NamespaceSwitch from './NamespaceSwitch'
import * as indexActions from '../actions'
import * as currentActions from '../actions/current'
import { scrollToTop, toQuerystring } from '../common/utils'
import { renderLoading } from '../components/utils'
import { JWT, AUTH_URL } from '../constants'
import { Route, Switch } from 'react-router-dom'
import { appChildRoutes } from '../RoutesDom'
import CustomizeSider from '../components/SiderNav'
import './style/App.less'

const { Footer } = Layout
let errorMessageBefore
let errorMessageBeforeDateTime
const errorMessageCloseObj = {}

// the routes need hide namespace switch
const HIDE_NAMESPACE_SWITCH_ROUTES = [ // 路由filter
  /^\/csb/, /msa-om\/csb-/,
  // /^\/setting/,
]

class App extends React.Component {
  state = {
    switchProjectOrCluster: false,
    switchProjectOrClusterText: null,
  }

  static propTypes = {
    // Injected by React Redux
    errorObject: PropTypes.object,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
    toggleCollapsed: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      getAuth,
      getCurrentUser,
      location,
      history,
    } = this.props
    const { pathname, search, hash } = location
    const query = parse(search)
    const { username, token, jwt, authUrl, ...otherQuery } = query
    getAuth({ username, token, jwt }).then(res => {
      if (res.type === indexActions.AUTH_FAILURE) {
        Modal.error({
          title: '认证失败',
          content: '请您刷新页面重试或点击确定返回',
          closable: false,
          onOk: () => history.goBack(),
        })
        return
      }
      const resJWT = res.response.entities.auth[JWT]
      // Save jwt token to localStorage
      if (localStorage) {
        localStorage.setItem(JWT, resJWT.token)
        authUrl && localStorage.setItem(AUTH_URL, authUrl)
      }
      const { userID } = resJWT
      // replace history
      history.replace(`${pathname}?${toQuerystring(otherQuery)}${hash}`)
      // Get user detail info
      return getCurrentUser(userID)
    })
  }

  componentDidUpdate(prevProps) {
    const {
      location: newLocation,
      currentConfig: newCurrentConfig,
    } = this.props
    const {
      location: oldLocation,
      currentConfig: oldCurrentConfig,
    } = prevProps
    // Scroll to top when pathname change
    if (newLocation.pathname !== oldLocation.pathname) {
      document.body.scrollTop = 0
    }
    const { pathname: newPathname, search: newSearch } = newLocation
    const { pathname: oldPathname, search: oldSearch } = oldLocation
    const newPath = newPathname + newSearch
    const oldPath = oldPathname + oldSearch
    if (newPath !== oldPath) {
      scrollToTop()
    }
    // Show switch project/cluster
    const switchProjectOrClusterText = '切换项目/集群中 ...'
    const { project: newProject, cluster: newCluster } = newCurrentConfig
    const { project: oldProject, cluster: oldCluster } = oldCurrentConfig
    if (!newProject || !newCluster) {
      return
    }
    if (newProject.namespace !== oldProject.namespace
      || newCluster.id !== oldCluster.id
    ) {
      clearTimeout(this.switchProjectOrClusterTimeout)
      this.setState({
        switchProjectOrCluster: true,
        switchProjectOrClusterText,
      }, () => {
        this.switchProjectOrClusterTimeout = setTimeout(() => {
          this.setState({
            switchProjectOrCluster: false,
          })
        }, 200)
      })
    }
  }

  renderErrorMessage = () => {
    const { errorObject, resetErrorMessage, location } = this.props
    const { pathname } = location
    if (!errorObject) {
      return null
    }
    const { message, status, options } = errorObject
    if (message === 'Failed to fetch') {
      messageTip.warn('网络或服务暂时不可用，请稍后重试')
      resetErrorMessage()
      return
    }
    if (!errorMessageCloseObj[errorMessageBeforeDateTime]
      && errorMessageBefore === message
      && (Date.now() - errorMessageBeforeDateTime) < 4500
    ) {
      return
    }
    if (status === 401 && message === 'token expired') {
      const authUrl = localStorage && localStorage.getItem(AUTH_URL)
      Modal.error({
        title: '认证信息已过期',
        content: authUrl ? '请点击确定重新认证' : '请回到容器平台「微服务入口」重新进入',
        okText: authUrl ? '确定' : '知道了',
        onOk: () => {
          resetErrorMessage()
          errorMessageCloseObj[errorMessageBeforeDateTime] = true
          if (authUrl) {
            const query = {
              redirect: window.location.href,
            }
            window.location = `${authUrl}?${toQuerystring(query)}`
          }
        },
      })
      return
    }
    if (status === 409
      && pathname.includes('/csb-instances-available/')
      && pathname.includes('/publish-service')) {
      notification.warn({
        message: '该实例中已存在同名称同版本的服务',
        onClose: () => {
          resetErrorMessage()
          errorMessageCloseObj[errorMessageBeforeDateTime] = true
        },
      })
      return
    }
    errorMessageBefore = message
    errorMessageBeforeDateTime = Date.now()
    setTimeout(() => {
      if (options && options.isHandleError) {
        return resetErrorMessage()
      }
      notification.warn({
        message,
        onClose: () => {
          resetErrorMessage()
          errorMessageCloseObj[errorMessageBeforeDateTime] = true
        },
      })
    })
    setTimeout(() => resetErrorMessage(), 4500)
  }

  renderChildren = () => {
    const { current, children } = this.props
    const { switchProjectOrCluster, switchProjectOrClusterText } = this.state
    const { config, user } = current
    if (!config.project || !config.project.namespace) {
      return renderLoading('加载基础配置中 ...')
    }
    if (!config.cluster || !config.cluster.id) {
      return renderLoading('加载集群配置中 ...')
    }
    if (!user || !user.info) {
      return renderLoading('加载用户信息中 ...')
    }
    if (switchProjectOrCluster) {
      return renderLoading(switchProjectOrClusterText)
    }
    return [
      children,
      <Switch key="switch">
        {
          appChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const {
      auth,
      location,
      current,
      toggleCollapsed,
    } = this.props
    const jwt = auth[JWT] || {}
    if (!jwt.token) {
      return renderLoading('Loading...')
    }
    let isHideNamespaceSwitch = false
    HIDE_NAMESPACE_SWITCH_ROUTES.every(regExp => {
      if (regExp.test(location.pathname)) {
        isHideNamespaceSwitch = true
        return false
      }
      return true
    })
    const namespaceSwitchClassname = ClassNames({
      hide: isHideNamespaceSwitch,
    })
    const { collapsed } = current.ui
    const appStyle = ClassNames({
      appSiderWide: collapsed,
      appSiderSmall: !collapsed,
    })
    return (
      <Layout className={'app'}>
        <CustomizeSider
          currentUser={current.user.info || {}}
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        />
        <Layout id="app" className={appStyle} >
          {this.renderErrorMessage()}
          <Header
            collapsed={current.ui.collapsed}
            location={location}
            currentUser={current.user.info || {}}
          >
            <NamespaceSwitch
              noSelfClassName
              userID={jwt.userID}
              className={namespaceSwitchClassname}
            />
          </Header>

          { this.renderChildren() }
          <Footer style={{ textAlign: 'center' }} id="footer">
            © 2018 微服务治理平台 v1.2
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { entities } = state
  const { auth } = entities
  const current = state.current || {}
  return {
    errorObject: state.errorObject,
    auth,
    current,
    currentConfig: current.config || {},
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage: indexActions.resetErrorMessage,
  getAuth: indexActions.getAuth,
  getCurrentUser: currentActions.getCurrentUser,
  toggleCollapsed: currentActions.toggleCollapsed,
})(App)
