/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * siderNav Component
 *
 * @author songsz
 * @date 2018-05-16
 */
import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import './style/index.less'
import find from 'lodash/find'
import { ROLE_SYS_ADMIN } from '../../constants'
import logo from '../../assets/img/logo.svg'
import logoSmall from '../../assets/img/logo-small.svg'
import msaconfig from '../../assets/img/msa-manage/msa.svg'
import topologyIcon from '../../assets/img/apm/apm.svg'
import msaComponent from '../../assets/img/msa-om/msa-component.svg'
import csbInstancesOm from '../../assets/img/msa-om/csb-instances-om.svg'
import performanceIcon from '../../assets/img/apm/performance.svg'
import callLinkTrackingIcon from '../../assets/img/apm/call-link-tracking.svg'
import configCenterIcon from '../../assets/img/msa-manage/config-center.svg'
import routingManageIcon from '../../assets/img/msa-manage/routing-manage.svg'
import apiGatewayIcon from '../../assets/img/msa-manage/api-gateway.svg'
import blownMonitoringIcon from '../../assets/img/msa-manage/blown-monitoring.svg'
import certificationManageIcon from '../../assets/img/msa-manage/certification-manage.svg'
import eventManageIcon from '../../assets/img/msa-manage/event-manage.svg'

const { Sider } = Layout
const SubMenu = Menu.SubMenu

const menus = [
  {
    to: '/msa-manage',
    key: 'msa-manage',
    name: '微服务治理',
    icon: 'api',
    children: [
      {
        key: 'k40',
        to: '/msa-manage',
        icon: 'bars',
        name: '微服务列表',
      }, {
        key: 'k41',
        to: '/msa-manage/config-center',
        icon: configCenterIcon,
        name: '配置中心',
      }, {
        key: 'k42',
        to: '/msa-manage/call-link-tracking',
        icon: 'link',
        name: '服务调用链',
      }, {
        key: 'k43',
        to: '/msa-manage/routing-manage',
        icon: routingManageIcon,
        name: '路由管理',
      }, {
        key: 'k44',
        to: '/msa-manage/api-gateway',
        icon: apiGatewayIcon,
        name: '服务限流',
      }, {
        key: 'k45',
        to: '/msa-manage/blown-monitoring',
        icon: blownMonitoringIcon,
        name: '熔断监控',
      }, {
        key: 'k46',
        to: '/msa-manage/certification-manage',
        icon: certificationManageIcon,
        name: '认证管理',
        defaultOpen: true,
        children: [
          {
            key: 'k461',
            to: '/msa-manage/certification-manage/clients',
            name: '客户端管理',
            // disabled: true,
          }, {
            key: 'k462',
            to: '/msa-manage/certification-manage/auth-mode',
            name: '授权方式查看',
          }, {
            key: 'k63',
            to: '/msa-manage/certification-manage/auth-scope',
            name: '授权范围查看',
          },
        ],
      }, {
        key: 'event-manage',
        to: '/msa-manage/event-manage',
        icon: eventManageIcon,
        name: '事件管理',
        defaultOpen: true,
        children: [
          {
            key: 'event',
            to: '/msa-manage/event-manage/event',
            name: '事件',
          },
        ],
      },
    ],
  }, {
    key: 'k3',
    to: '/csb-instances',
    icon: 'fork',
    name: '服务总线',
    children: [
      {
        key: 'mine-csb-instances',
        icon: 'user',
        name: '我的实例',
        defaultOpen: true,
        children: [
          {
            key: 'k300',
            to: '/csb-instances/available',
            name: '可用实例',
          }, {
            key: 'k301',
            to: '/csb-instances/my-application',
            name: '我的申请',
          },
        ],
      }, {
        key: 'k31',
        icon: 'unlock',
        name: '可申请实例',
        defaultOpen: true,
        children: [
          {
            key: 'k310',
            to: '/csb-instances/public',
            name: '可申请实例',
          },
        ],
      },
    ],
  }, {
    key: 'k2',
    to: '/apms',
    icon: 'bar-chart',
    name: '性能管理（APM）',
    children: [
      {
        key: 'k20',
        to: '/apms/topology',
        icon: topologyIcon,
        name: '微服务拓扑',
      }, {
        key: 'k21',
        to: '/apms/performance',
        icon: performanceIcon,
        name: '微服务性能',
      }, {
        key: 'k22',
        to: '/apms/call-link-tracking',
        icon: callLinkTrackingIcon,
        name: '调用链路跟踪',
      },
    ],
  }, {
    key: 'msa-om',
    to: '/msa-om',
    name: '微服务运维',
    icon: 'appstore',
    children: [
      {
        key: 'k00',
        to: '/msa-om/components',
        name: '微服务组件',
        icon: msaComponent,
      }, {
        key: 'k01',
        to: '/cluster',
        name: 'CSB 运维',
        icon: csbInstancesOm,
        defaultOpen: true,
        children: [
          {
            key: 'k010',
            to: '/msa-om/csb-instance-om',
            name: '实例列表',
          }, {
            key: 'k011',
            to: '/msa-om/csb-instance-approval',
            name: '实例审批',
          }, {
            key: 'k012',
            to: '/msa-om/csb-cascading-link-rules',
            name: '级联链路规则',
          },
        ],
      }, {
        key: 'k02',
        to: '/msa-om/log',
        name: '日志查询',
        icon: 'file-text',
      },
    ],
  }, {
    key: 'k1',
    to: '/setting',
    name: '系统设置',
    icon: 'setting',
    children: [
      {
        key: 'k10',
        to: '/setting/global-setting',
        name: '全局配置',
        icon: 'setting',
      }, {
        key: 'k11',
        to: '/setting/msa-config',
        name: '微服务配置',
        icon: msaconfig,
      }, {
        key: 'k12',
        to: '/setting/apms',
        name: 'APM 配置',
        icon: topologyIcon,
      },
    ],
  },
]
const svgIcon = icon => (
  <svg className="itemIcon">
    <use xlinkHref={`#${icon.id}`} />
  </svg>
)
@withRouter
class SiderNav extends React.Component {
  state = {
    collapsed: false,
    openKeys: [],
  };
  componentDidMount() {
    this.setState({
      openKeys: this.findSelectedNOpenKeys().openKeys,
    })
  }
  onCollapse = collapsed => {
    this.setState({ collapsed })
    if (collapsed) {
      this.setState({
        openKeys: [],
      })
    }
    const { toggleCollapsed } = this.props
    toggleCollapsed && toggleCollapsed(collapsed)
  }
  renderMenuItem = data => {
    const { children, name, icon, key, to, ...otherProps } = data
    let iconDOM
    if (icon && (typeof icon === 'string')) iconDOM = <Icon type={icon} />
    if (icon && (typeof icon === 'object')) iconDOM = svgIcon(icon)
    if (children) {
      return (
        <SubMenu
          key={key}
          title={<span>{ iconDOM }<span>{name}</span></span>}
          {...otherProps}
        >
          {
            children.map(item => this.renderMenuItem(item))
          }
        </SubMenu>
      )
    }
    return (
      <Menu.Item key={key} {...otherProps}>
        <Link to={to}>{iconDOM}<span className="nav-text">{name}</span></Link>
      </Menu.Item>
    )
  }
  findSelectedNOpenKeys = () => {
    const { location, collapsed } = this.props
    const { pathname } = location
    const pathnameList = pathname.split('/').filter(item => item !== '')
    let defaultOpenKeys = []
    menus.map(menu => {
      let firstPathList = []
      menu.children && menu.to && (firstPathList = menu.to.split('/').filter(i => i !== ''))
      if (pathnameList[0] === firstPathList[0]) defaultOpenKeys.push(menu.key)
      return null
    })
    const finderPath = (obj, list) => {
      const { to, children, defaultOpen, key } = obj
      if (defaultOpen) defaultOpenKeys.push(key)
      if (children) {
        children.map(item => finderPath(item, list))
        return
      }
      // (to === pathname) && list.push(key)
      if (pathname.indexOf(to) > -1) {
        (list.length === 0) && list.push(obj)
        ;(list.length > 0) && (to.indexOf(list[0].to) > -1) && (list[0] = obj)
      }
      return list
    }
    let s = []
    menus.map(menu => finderPath(menu, s))
    ;(s.length > 0) && (s = [ s[0].key ])
    if (collapsed) {
      defaultOpenKeys = []
      s = []
    }
    return {
      openKeys: defaultOpenKeys,
      selectedKeys: s,
    }
  }
  onOpenChange = data => {
    const { openKeys } = this.state
    if (openKeys.length >= data.length) {
      this.setState({
        openKeys: data,
      })
      return
    }
    let add = ''
    let addIsFirst = false
    let finalKeys = []
    data.map(i => (openKeys.indexOf(i) < 0) && (add = i))
    add && menus.map(menu => {
      if (menu.key === add) addIsFirst = true
      return null
    })
    if (addIsFirst) {
      openKeys.map(k => (!find(menus, [ 'key', k ])) && finalKeys.push(k))
      add && finalKeys.push(add)
    }
    if (!addIsFirst) finalKeys = data
    this.setState({
      openKeys: finalKeys,
    })
  }

  render() {
    const { collapsed, currentUser } = this.props
    const finalMenus = currentUser.role !== ROLE_SYS_ADMIN ? menus.filter(menu => menu.key !== 'msa-om') : menus
    return (
      <Sider
        style={{ overflow: 'auto', height: '100vh', position: 'fixed' }}
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
      >
        <div className="sider-nav">
          <div className={'logoContainer'}>
            <svg className={collapsed ? 'logoSmall ' : 'logo'}>
              <use xlinkHref={`#${collapsed ? logoSmall.id : logo.id}`} />
            </svg>
          </div>
          {
            <Menu
              style={{ marginTop: 70 }}
              theme="dark"
              mode="inline"
              onOpenChange={this.onOpenChange}
              // onClick={data => console.log('ddd', data) }
              selectedKeys={this.findSelectedNOpenKeys().selectedKeys}
              openKeys={this.state.openKeys}
            >
              {
                finalMenus.map(item => this.renderMenuItem(item))
              }
            </Menu>
          }
        </div>
      </Sider>
    )
  }
}

export default SiderNav
