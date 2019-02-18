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
// import ClassNames from 'classnames'
import { Layout, Modal, notification, message as messageTip } from 'antd'
import { parse } from 'query-string'
// import Header from '../components/Header'
// import NamespaceSwitch from './NamespaceSwitch'
import * as indexActions from '../actions'
import * as currentActions from '../actions/current'
import { scrollToTop, toQuerystring } from '../common/utils'
import { renderLoading } from '../components/utils'
import { AUTH_URL, API_CONFIG } from '../constants'
import { Route, Switch, Link } from 'react-router-dom'
import { appChildRoutes } from '../'
// import CustomizeSider from '../components/SiderNav'
import './style/App.less'
import { footer } from '../../config/constants'
import noProjectsImage from '../assets/img/no-projects.png'
import noClustersImage from '../assets/img/no-clusters.png'
import { withNamespaces } from 'react-i18next'
import UnifiedNav from '@tenx-ui/b-unified-navigation'
import '@tenx-ui/b-unified-navigation/assets/index.css'
import moment from 'moment'

const { PAAS_API_URL, USERPORTAL_URL } = API_CONFIG
const { Footer } = Layout
let errorMessageBefore
let errorMessageBeforeDateTime
const errorMessageCloseObj = {}

// the routes need hide namespace switch
const HIDE_NAMESPACE_SWITCH_ROUTES = [ // 路由filter
  /^\/csb/, /msa-om\/csb-/,
  /^\/setting/, /^\/msa-om/,
  /^\/msa-om\/log/,
  // /^\/service-mesh$/,
]

@withNamespaces('common')
class App extends React.Component {
  constructor(props) {
    super(props)
    this.query = parse(location.search)
  }

  state = {
    switchProjectOrCluster: false,
    switchProjectOrClusterText: null,
    locale: this.props.i18n.language.split('-')[0],
  }

  static propTypes = {
    // Injected by React Redux
    errorObject: PropTypes.object,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
    toggleCollapsed: PropTypes.func.isRequired,
  }

  momentLocale = language => {
    if (language === 'en') {
      moment.locale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: '%d s',
          m: 'a min',
          mm: '%d min',
          h: '1 h',
          hh: '%d h',
          d: 'a day',
          dd: '%d days',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years',
        },
      })
      return
    }
    moment.locale('zh-cn')
  }


  async componentDidMount() {
    /* console.log('locale', this.state.locale)
    const {
      getAuth,
      getCurrentUser,
      location,
      history,
    } = this.props
    const { pathname, search, hash } = location
    const query = parse(search)
    this.setState({ query }) */
    /* const { username, token, jwt, authUrl, redirectclusterID, redirectNamespace,
      ...otherQuery } = query
    if (!!redirectclusterID && !!redirectNamespace) {
      await this.props.setCurrentConfig({
        project: {
          namespace: redirectNamespace,
        },
        cluster: { id: redirectclusterID },
      })
    }
    await getAuth({ username, token, jwt }).then(res => {
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
    }) */
  }

  onAuthReady = (authData, loginUser) => {
    const { setCurrentUser, location, history } = this.props
    // set loginUser to store
    setCurrentUser(loginUser)
    const { pathname, hash } = location
    const { authUrl, ...otherQuery } = this.query
    // save auth url to localStorage
    authUrl && localStorage.setItem(AUTH_URL, authUrl)
    // replace location
    const authQuery = [ 'username', 'token', 'jwt', 'authUrl', 'redirectclusterID', 'redirectNamespace' ]
    authQuery.forEach(key => delete otherQuery[key])
    history.replace(`${pathname}?${toQuerystring(otherQuery)}${hash}`)
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
      scrollToTop('.unified-nav-layout-has-sider .unified-nav-layout-content')
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
    if (message === 'Failed to fetch' ||
    (status === 503 && message === '503 Service Unavailable'
    && !pathname.includes('/msa-manage/detail'))) {
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
    const { space: { noProjectsFlag, noClustersFlag } = {} } = config

    if (!user || !user.info) {
      return renderLoading('加载用户信息中 ...')
    }
    const noHeadernoShow = HIDE_NAMESPACE_SWITCH_ROUTES
      .some(regExp => regExp.test(location.pathname))
    if (noHeadernoShow) {
      return [
        children,
        <Switch key="switch">
          {
            appChildRoutes.map(routeProps => <Route {...routeProps} />)
          }
        </Switch>,
      ]
    }
    // 当没有可用项目时
    if (noProjectsFlag) {
      return (
        <div className="noclustersOrPrjects">
          <div className="noclustersOrPrjectsinfoWrap">
            <img src={noProjectsImage} alt="no-projects" />
            <br />
            <span>
          帐号还未加入任何项目，请先『创建项目』或『联系管理员加入项目』
            </span>
          </div>
        </div>)
    }
    // 当没有可用集群时
    if (noClustersFlag) {
      return (
        <div className="noclustersOrPrjects">
          <div className="noclustersOrPrjectsinfoWrap">
            <img src={noClustersImage} alt="no-clusters" />
            <br />
            <span>
            项目暂无授权的集群，请先申请『授权集群』或选择其他项目
            </span>
          </div>
        </div>
      )
    }
    if (!config.project || !config.project.namespace) {
      return renderLoading('加载基础配置中 ...')
    }
    if (!config.cluster || !config.cluster.id) {
      return renderLoading('加载集群配置中 ...')
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
      <Footer key="footer" style={{ textAlign: 'center' }} id="footer">
        {footer}
      </Footer>,
    ]
  }

  changeLocale = locale => {
    this.props.i18n.changeLanguage(locale)
    this.momentLocale(locale)
    this.setState({ locale })
    this.props.forceUpdateApp()
  }

  onProjectChange = (project, projects) => {
    const { setCurrentConfig, setListProjects } = this.props
    setCurrentConfig({
      project,
      cluster: {},
    })
    setListProjects(projects)
  }

  onClusterChange = (cluster, clusters) => {
    const { setCurrentConfig, setProjectClusters, currentConfig } = this.props
    cluster.id = cluster.clusterID
    setCurrentConfig({
      cluster,
    })
    const { namespace } = currentConfig.project
    setProjectClusters(namespace, clusters[namespace])
  }

  render() {
    /* const {
      auth,
      location,
      current,
      toggleCollapsed,
      managedProjects,
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
    }) */
    const { location } = this.props
    const { pathname } = location
    // const { query } = this.state
    const {
      username, token, jwt, redirectclusterID, redirectNamespace,
    } = this.query
    const config = {
      paasApiUrl: PAAS_API_URL,
      userPortalUrl: USERPORTAL_URL,
      msaPortalUrl: window.location.origin,
      defaultProject: redirectNamespace,
      defaultCluster: redirectclusterID,
    }
    return (
      <UnifiedNav
        portal="msa-portal"
        pathname={pathname}
        showSider={true}
        showHeader={true}
        Link={Link}
        config={config}
        onProjectChange={this.onProjectChange}
        onClusterChange={this.onClusterChange}
        onAuthReady={this.onAuthReady}
        username={username}
        token={token}
        jwt={jwt}
        locale={this.state.locale}
        changeLocale={this.changeLocale}
      >
        { this.renderChildren() }
      </UnifiedNav>
    )
    /* return (
      <Layout className={'app'}>
        <CustomizeSider
          currentUser={current.user.info || {}}
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          managedProjects={managedProjects}
        />
        <Layout id="app" className={appStyle} >
          {this.renderErrorMessage()}
          <Header
            collapsed={current.ui.collapsed}
            location={location}
            currentUser={current.user.info || {}}
            forceUpdateApp={this.props.forceUpdateApp}
          >
            <NamespaceSwitch
              noSelfClassName
              userID={jwt.userID}
              className={namespaceSwitchClassname}
            />
          </Header>

          { this.renderChildren() }
          <Footer style={{ textAlign: 'center' }} id="footer">
            {footer}
          </Footer>
        </Layout>
      </Layout>
    ) */
  }
}

const mapStateToProps = state => {
  const { entities } = state
  const { auth, projects } = entities
  const current = state.current || {}
  const userProjects = current.projects && current.projects.ids || []
  const managedProjects = userProjects.map(namespace => projects[namespace])
    .filter(({ outlineRoles }) => !outlineRoles.includes('no-participator') && outlineRoles.includes('manager'))
  return {
    errorObject: state.errorObject,
    auth,
    current,
    currentConfig: current.config || {},
    managedProjects,
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage: indexActions.resetErrorMessage,
  getAuth: indexActions.getAuth,
  getCurrentUser: currentActions.getCurrentUser,
  toggleCollapsed: currentActions.toggleCollapsed,
  setCurrentConfig: currentActions.setCurrentConfig,
  setCurrentUser: currentActions.setCurrentUser,
  setListProjects: currentActions.setListProjects,
  setProjectClusters: currentActions.setProjectClusters,
})(App)
