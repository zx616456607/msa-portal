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
import { Layout, Modal, notification } from 'antd'
import { parse } from 'query-string'
import Header from '../components/Header'
import NamespaceSwitch from './NamespaceSwitch'
import { resetErrorMessage, getAuth, AUTH_FAILURE } from '../actions'
import {
  getCurrentUser,
} from '../actions/current'
import { scrollToTop, toQuerystring } from '../common/utils'
import { renderLoading } from '../components/utils'
import { JWT, AUTH_URL } from '../constants'
import { Route, Switch } from 'react-router-dom'
import { appChildRoutes } from '../RoutesDom'
import CustomizeSider from '../components/SiderNav'

const { Footer } = Layout
let errorMessageBefore
let errorMessageBeforeDateTime
const errorMessageCloseObj = {}

// the routes need hide namespace switch
const HIDE_NAMESPACE_SWITCH_ROUTES = [
  /^\/csb/, /msa-om\/csb-/,
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
  }

  componentWillMount() {
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
      if (res.type === AUTH_FAILURE) {
        Modal.error({
          title: '认证失败',
          content: '请您刷新页面重试或点击确定返回',
          closable: false,
          onOk: () => history.goBack(),
        })
        return
      }
      const jwt = res.response.entities.auth[JWT]
      // Save jwt token to localStorage
      if (localStorage) {
        localStorage.setItem(JWT, jwt.token)
        authUrl && localStorage.setItem(AUTH_URL, authUrl)
      }
      const { userID } = jwt
      // replace history
      history.replace(`${pathname}?${toQuerystring(otherQuery)}${hash}`)
      // Get user detail info
      return getCurrentUser(userID)
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: newLocation,
      currentConfig: newCurrentConfig,
    } = nextProps
    const {
      location: oldLocation,
      currentConfig: oldCurrentConfig,
    } = this.props
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
    const { errorObject, resetErrorMessage } = this.props
    if (!errorObject) {
      return null
    }
    const { message, status } = errorObject
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
    errorMessageBefore = message
    errorMessageBeforeDateTime = Date.now()
    setTimeout(() => {
      notification.error({
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
    return (
      <Layout>
        <CustomizeSider/>
        <Layout id="app">
          {this.renderErrorMessage()}
          <Header
            location={location}
            currentUser={current.user.info || {}}
          />
          <NamespaceSwitch userID={jwt.userID} className={namespaceSwitchClassname} />
          { this.renderChildren() }
          <Footer style={{ textAlign: 'center' }} id="footer">
            © 2017 北京云思畅想科技有限公司 | 时速云微服务治理平台 v1.0
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
  resetErrorMessage,
  getAuth,
  getCurrentUser,
})(App)
