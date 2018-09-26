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
import { Layout,
  // Menu, Icon, Dropdown
} from 'antd'
// import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { loadApms, getApmService } from '../../actions/apm'
import { Route, Switch } from 'react-router-dom'
import { apmChildRoutes } from '../../RoutesDom'
import { renderLoading } from '../../components/utils'
// import topologyIcon from '../../assets/img/apm/topology.svg'
// import performanceIcon from '../../assets/img/apm/performance.svg'
// import callLinkTrackingIcon from '../../assets/img/apm/call-link-tracking.svg'
import pinPoint from '../../assets/img/apm/Pinpoint.png'

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
  componentDidMount() {
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
      loadApms(clusterID, current.config.project.namespace)
    })
  }

  renderChildren = () => {
    const { apms, children } = this.props
    if (!apms || apms.isFetching === true) {
      return renderLoading('加载 APM 中 ...')
    }
    if (!apms.ids || apms.ids.length === 0) {
      return <div className="loading">
        <img alt="pinpoint-not-intall" src={pinPoint}/>
        <div>当前项目对应的集群，未安装 PinPoint 基础服务组件，</div>
        <div>请『联系系统管理员』安装</div>
      </div>
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
    // const title = (
    //   <div>
    //     性能管理（APM）
    //     <div className="apm-switch">
    //       <Dropdown
    //         overlay={
    //           <Menu>
    //             <Menu.Item key="PinPoint">
    //               PinPoint
    //             </Menu.Item>
    //           </Menu>
    //         }
    //         trigger={[ 'click' ]}>
    //         <a className="ant-dropdown-link">
    //           基于 PinPoint <Icon type="down" />
    //         </a>
    //       </Dropdown>
    //     </div>
    //   </div>
    // )
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
  apms = apms[cluster.id] || { isFetching: true }
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
