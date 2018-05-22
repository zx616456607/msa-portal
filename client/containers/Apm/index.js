/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apm container
 *
 * 2017-08-23
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Dropdown } from 'antd'
// import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { loadApms, getApmService } from '../../actions/apm'
import { Route, Switch } from 'react-router-dom'
import { apmChildRoutes } from '../../RoutesDom'
import { renderLoading } from '../../components/utils'
// import topologyIcon from '../../assets/img/apm/topology.svg'
// import performanceIcon from '../../assets/img/apm/performance.svg'
// import callLinkTrackingIcon from '../../assets/img/apm/call-link-tracking.svg'
import confirm from '../../components/Modal/confirm'

// const menus = [
//   {
//     to: '/apms/topology',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${topologyIcon.id}`} />
//       </svg>
//     ),
//     text: '微服务拓扑',
//   },
//   {
//     to: '/apms/performance',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${performanceIcon.id}`} />
//       </svg>
//     ),
//     text: '微服务性能',
//   },
//   {
//     to: '/apms/call-link-tracking',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${callLinkTrackingIcon.id}`} />
//       </svg>
//     ),
//     text: '调用链路跟踪',
//   },
// ]

class Apm extends React.Component {
  componentWillMount() {
    const { loadApms, current, getApmService } = this.props
    const clusterID = current.config.cluster.id
    const body = {
      id: clusterID,
      pinpoint: 'pinpoint',
    }
    getApmService(body).then(res => {
      if (res.error) {
        return
      }
      const { config, user } = current
      const projectNamespace = config.project.namespace
      let namespace = config.project.namespace
      if (projectNamespace === 'default') {
        namespace = user.info.namespace
      }
      const ApmStatusArray = res.response.result.data
      let currentNamespaceStatus = false
      ApmStatusArray.forEach(item => {
        if (item.namespace === namespace) {
          currentNamespaceStatus = true
        }
      })
      if (!currentNamespaceStatus) {
        const { history } = this.props
        confirm({
          modalTitle: '提示',
          title: '当前项目 & 集群：PinPoint 基础服务组件未安装',
          okText: '前往安装',
          hideCancelButton: true,
          cancelText: '返回首页',
          onOk: () => {
            history.push('/setting/apms')
          },
          onCancel: () => {
            history.push('/')
          },
        })
        return
      }
      loadApms(clusterID)
    })
  }

  renderChildren = () => {
    const { apms, children } = this.props
    if (!apms || !apms.ids || apms.isFetching) {
      return renderLoading('加载 APM 中 ...')
    }
    return [
      children,
      <Switch key="switch">
        {
          apmChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    // const { location } = this.props
    const title = (
      <div>
        性能管理（APM）
        <div className="apm-switch">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="PinPoint">
                  PinPoint
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a className="ant-dropdown-link">
              基于 PinPoint <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </div>
    )
    return (
      <Layout className="apm">
        {/* <Sider
          key="sider"
          title={title}
          location={location}
          menu={{
            items: menus,
          }}
        />*/}
        <Content>
          {title}
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { current, queryApms } = state
  const { project, cluster } = current.config
  let apms = queryApms[project.namespace] || {}
  apms = apms[cluster.id] || {}
  return {
    auth: state.entities.auth,
    current: current || {},
    apms,
  }
}

export default connect(mapStateToProps, {
  loadApms,
  getApmService,
})(Apm)
