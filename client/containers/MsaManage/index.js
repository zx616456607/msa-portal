/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa manage container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout,
  // Menu, Icon, Dropdown,
} from 'antd'
// import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { Route, Switch, Redirect } from 'react-router-dom'
import { renderLoading } from '../../components/utils'
import { fetchSpingCloud } from '../../actions/msaConfig'
import spingCloud from '../../assets/img/apm/Sringcloud.png'
import RegisterMsa from './MsaList/RegisterMsa'
import MsaList from './MsaList/index'
import MsaDetail from './MsaList/MsaDetail'
import MsaConfigCenter from './ConfigCenter/ConfigCenter'
import CreateConfig from './ConfigCenter/CreateConfig'
import MsaCallLinkTracking from './CallLinkTracking/index'
import MsaCallLinkTrackDetail from './CallLinkTracking/CallLinkTrackDetail/index'
import MsaCallLinkTrackingRelation from './CallLinkTracking/RelationShip/index'
import MsaRoutingManage from './RoutingManage/index'
import ApiGateway from './ApiGateway'
import ApiGatewayMonitoring from './ApiGatewayMonitoring'
import BlownMonitoring from './BlownMonitoring'
import CertificationManageAuthZone from './CertificationManage/AuthZone'
import AuthZoneDetail from './CertificationManage/AuthZone/AuthZoneDetail'
import CertificationManageAuthMode from './CertificationManage/AuthMode'
import CertificationManageAuthScope from './CertificationManage/AuthScope'
import Event from './EventManage/Event/index'
import { withNamespaces } from 'react-i18next'

const msaManageChildRoutes = [
  {
    path: '/msa-manage',
    exact: true,
    component: MsaList,
    key: 'index',
  },
  {
    path: '/msa-manage/register',
    exact: true,
    component: RegisterMsa,
    key: 'register',
  },
  {
    path: '/msa-manage/detail/:name',
    exact: true,
    component: MsaDetail,
    key: 'msa-detail',
  },
  {
    path: '/msa-manage/config-center',
    exact: true,
    component: MsaConfigCenter,
    key: 'config-center',
  },
  {
    path: '/msa-manage/config-center/config/create',
    component: CreateConfig,
    exact: true,
    key: 'create-config',
  },
  {
    path: '/msa-manage/config-center/:id',
    component: CreateConfig,
    exact: true,
    key: 'config-detail',
  },
  {
    path: '/msa-manage/call-link-tracking',
    exact: true,
    component: MsaCallLinkTracking,
    key: 'call-link-tracking',
  },
  {
    path: '/msa-manage/call-link-tracking/:id',
    exact: true,
    component: MsaCallLinkTrackDetail,
    key: 'call-link-tracking-detail',
  },
  {
    path: '/msa-manage/call-link-tracking-relation',
    exact: true,
    key: 'call-link-tracking-relation',
    component: MsaCallLinkTrackingRelation,
  },
  {
    path: '/msa-manage/routing-manage',
    exact: true,
    component: MsaRoutingManage,
    key: 'routing-manage',
  },
  {
    path: '/msa-manage/api-gateway',
    exact: true,
    component: ApiGateway,
    key: 'api-gateway',
  },
  {
    path: '/msa-manage/api-gateway-monitoring',
    exact: true,
    component: ApiGatewayMonitoring,
    key: 'api-gateway-monitoring',
  },
  {
    path: '/msa-manage/blown-monitoring',
    exact: true,
    component: BlownMonitoring,
    key: 'blown-monitoring',
  },
  {
    path: '/msa-manage/certification-manage',
    exact: true,
    render: () => <Redirect to="/msa-manage/certification-manage/auth-zone" component={CertificationManageAuthZone} />,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-zone',
    exact: true,
    component: CertificationManageAuthZone,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-zone/:zoneId',
    exact: true,
    component: AuthZoneDetail,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-mode',
    exact: true,
    component: CertificationManageAuthMode,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-scope',
    exact: true,
    component: CertificationManageAuthScope,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/event-manage',
    exact: true,
    render: () => <Redirect to="/msa-manage/event-manage/event" component={Event} />,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/event-manage/event',
    exact: true,
    component: Event,
    key: 'event-manage',
  },
]

@withNamespaces('common')
class MsaManage extends React.Component {
  state = {
    isDeployed: false,
    loading: true,
  }

  componentDidMount() {
    const { current, fetchSpingCloud } = this.props
    const clusterID = current.config.cluster.id
    fetchSpingCloud(clusterID).then(res => {
      this.setState({
        isDeployed: checkSpringCloudInstall(res, current),
        loading: false,
      })
    })
  }

  renderChildren = () => {
    const { children, t } = this.props
    const { isDeployed, loading } = this.state
    if (loading) {
      return renderLoading(t('springCloudNotInstalled.springCloudLoading'))
    }
    if (!isDeployed) {
      return notInstallSpringCloud()
    }
    return [
      children,
      <Switch key="switch">
        {
          msaManageChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    // const { location } = this.props
    // const title = (
    //   <div>
    //     微服务治理
    //     <div className="apm-switch">
    //       <Dropdown
    //         overlay={
    //           <Menu>
    //             <Menu.Item key="SpringCloud">
    //               SpringCloud
    //             </Menu.Item>
    //           </Menu>
    //         }
    //         trigger={[ 'click' ]}>
    //         <a className="ant-dropdown-link">
    //           基于 SpringCloud <Icon type="down" />
    //         </a>
    //       </Dropdown>
    //     </div>
    //   </div>
    // )
    return (
      <Layout className="msa-manage">
        {/* <Sider
          key="sider"
          title={title}
          location={location}
          menu={{
            items: menus,
          }}
        />*/}
        <Content key="content">
          {/* {title}*/}
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  return {
    current: current || {},
  }
}

export function notInstallSpringCloud() {
  @withNamespaces('common')
  class NotInstallComponent extends React.Component {
    render() {
      const { t } = this.props
      return <div className="loading">
        <img alt="spingcloud-not-intall" src={spingCloud}/>
        <div>{t('springCloudNotInstalled.noSpringCloud')}</div>
        <div>{t('springCloudNotInstalled.install')}</div>
      </div>
    }
  }
  return <NotInstallComponent/>
}

export function checkSpringCloudInstall(res, current) {
  let isDeployed = false
  if (!res.error) {
    const { config, user } = current
    const projectNamespace = config.project.namespace
    let namespace = config.project.namespace
    if (projectNamespace === 'default') {
      namespace = user.info.namespace
    }
    res.response.result.data.forEach(item => {
      if (item.namespace === namespace) {
        isDeployed = true
      }
    })
  }
  return isDeployed
}

export default connect(mapStateToProps, {
  fetchSpingCloud,
})(MsaManage)
