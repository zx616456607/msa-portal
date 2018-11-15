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
import { Route, Switch } from 'react-router-dom'
import { msaManageChildRoutes } from '../../RoutesDom'
import { renderLoading } from '../../components/utils'
import { fetchSpingCloud } from '../../actions/msaConfig'
import spingCloud from '../../assets/img/apm/Sringcloud.png'
// import configCenterIcon from '../../assets/img/msa-manage/config-center.svg'
// import routingManageIcon from '../../assets/img/msa-manage/routing-manage.svg'
// import apiGatewayIcon from '../../assets/img/msa-manage/api-gateway.svg'
// import apiGatewayMonitoringIcon from '../../assets/img/msa-manage/api-gateway-monitoring.svg'
// import blownMonitoringIcon from '../../assets/img/msa-manage/blown-monitoring.svg'
// import certificationManageIcon from '../../assets/img/msa-manage/certification-manage.svg'

// const menus = [
//   {
//     to: '/msa-manage',
//     text: '微服务列表',
//     icon: <Icon type="bars" style={{ fontSize: 16 }} />,
//   },
//   {
//     to: '/msa-manage/config-center',
//     text: '配置中心',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${configCenterIcon.id}`} />
//       </svg>
//     ),
//   },
//   {
//     to: '/msa-manage/call-link-tracking',
//     text: '服务调用链',
//     icon: <Icon type="link" />,
//   },
//   {
//     to: '/msa-manage/routing-manage',
//     text: '路由管理',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${routingManageIcon.id}`} />
//       </svg>
//     ),
//   },
//   {
//     to: '/msa-manage/api-gateway',
//     text: '服务限流',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${apiGatewayIcon.id}`} />
//       </svg>
//     ),
//   },
//   /* {
//     to: '/msa-manage/api-gateway-monitoring',
//     text: 'API 网关监控',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${apiGatewayMonitoringIcon.id}`} />
//       </svg>
//     ),
//   }, */
//   {
//     to: '/msa-manage/blown-monitoring',
//     text: '熔断监控',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${blownMonitoringIcon.id}`} />
//       </svg>
//     ),
//   },
//   {
//     type: 'SubMenu',
//     text: '认证管理',
//     to: '/msa-manage/certification-manage',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${certificationManageIcon.id}`} />
//       </svg>
//     ),
//     children: [
//       {
//         to: '/msa-manage/certification-manage/clients',
//         text: '客户端管理',
//         disabled: true,
//       },
//       {
//         to: '/msa-manage/certification-manage/auth-mode',
//         text: '授权方式查看',
//       },
//       {
//         to: '/msa-manage/certification-manage/auth-scope',
//         text: '授权范围查看',
//       },
//     ],
//   },
// ]
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
    const { children } = this.props
    const { isDeployed, loading } = this.state
    if (loading) {
      return renderLoading('加载 SpingCloud 中 ...')
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
    auth: state.entities.auth,
    current: current || {},
  }
}

export function notInstallSpringCloud() {
  return <div className="loading">
    <img alt="spingcloud-not-intall" src={spingCloud}/>
    <div>当前项目对应的集群，未安装 SpingCloud 基础服务组件，</div>
    <div>请『联系系统管理员』安装</div>
  </div>
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
