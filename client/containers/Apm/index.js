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
import { Route, Switch, Redirect } from 'react-router-dom'
import { renderLoading } from '../../components/utils'
// import topologyIcon from '../../assets/img/apm/topology.svg'
// import performanceIcon from '../../assets/img/apm/performance.svg'
// import callLinkTrackingIcon from '../../assets/img/apm/call-link-tracking.svg'
import pinPoint from '../../assets/img/apm/Pinpoint.png'
import Topology from './Topology'
import Performance from './Performance'
import CallLinkTracking from './CallLinkTracking'
import { withNamespaces } from 'react-i18next'


const apmChildRoutes = [
  {
    path: '/apms',
    exact: true,
    render: () => <Redirect to="/apms/topology" component={Topology} />,
    key: 'index',
  },
  {
    path: '/apms/topology',
    component: Topology,
    exact: true,
    key: 'topology',
  },
  {
    path: '/apms/performance',
    component: Performance,
    exact: true,
    key: 'performance',
  },
  {
    path: '/apms/call-link-tracking',
    component: CallLinkTracking,
    exact: true,
    key: 'call-link-tracking',
  },
]

@withNamespaces('common')
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
    const { apms, children, t } = this.props
    if (!apms || apms.isFetching === true) {
      return renderLoading(t('springCloud404.apmLoading'))
    }
    if (!apms.ids || apms.ids.length === 0) {
      return <div className="loading">
        <img alt="pinpoint-not-intall" src={pinPoint}/>
        <div>{t('springCloud404.noSpringCloud')}</div>
        <div>{t('springCloud404.install')}</div>
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
