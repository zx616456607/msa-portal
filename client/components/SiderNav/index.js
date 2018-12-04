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
import { Layout, Menu, Icon, Tooltip } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadApply } from '../../actions/CSB/myApplication'
import { getQueryKey } from '../../common/utils'

import './style/index.less'
import find from 'lodash/find'
import { ROLE_SYS_ADMIN, ROLE_PLATFORM_ADMIN, ROLE_BASE_ADMIN } from '../../constants'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { UNUSED_CLUSTER_ID } from '../../constants'
import { getDeepValue } from '../../common/utils';

const { Sider } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup;

const menus = [
  {
    to: '/',
    key: 'overview',
    name: '微服务总览',
    icon: 'bar-chart',
  },
  {
    to: '/msa-manage',
    key: 'msa-manage',
    name: '治理-SpringCloud',
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
        tenxIcon: 'config-center',
        name: '配置中心',
      }, {
        key: 'k42',
        to: '/msa-manage/call-link-tracking',
        icon: 'link',
        name: '服务调用链',
        children: [
          {
            key: 'call-link-tracking',
            to: '/msa-manage/call-link-tracking',
            name: '调用链查询',
          }, {
            key: 'call-link-tracking-relation',
            to: '/msa-manage/call-link-tracking-relation',
            name: '依赖关系',
          },
        ],
      }, {
        key: 'k43',
        to: '/msa-manage/routing-manage',
        tenxIcon: 'routing-manage',
        name: '路由管理',
      }, {
        key: 'k44',
        to: '/msa-manage/api-gateway',
        tenxIcon: 'gateway',
        name: '服务限流',
      }, {
        key: 'k45',
        to: '/msa-manage/blown-monitoring',
        tenxIcon: 'fusing',
        name: '熔断监控',
      }, {
        key: 'k46',
        to: '/msa-manage/certification-manage',
        tenxIcon: 'authentication',
        name: '认证管理',
        defaultopen: 'true',
        children: [
          {
            key: 'auth-zone',
            to: '/msa-manage/certification-manage/auth-zone',
            name: '认证域管理',
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
        tenxIcon: 'event-manage',
        name: '事件管理',
        defaultopen: 'true',
        children: [
          {
            key: 'event',
            to: '/msa-manage/event-manage/event',
            name: '事件',
          },
        ],
      }, {
        key: 'distribute',
        to: '/msa-manage/distribute',
        tenxIcon: 'event-manage',
        name: '分布式事务',
        defaultopen: 'true',
        children: [
          {
            key: 'distribute-list',
            to: '/msa-manage/distribute/list',
            name: '事务列表',
          },
          {
            key: 'distribute-record',
            to: '/msa-manage/distribute/distribute-record',
            name: '事务执行记录',
          },
        ],
      },
    ],
  },
  {
    key: 'service-mesh',
    to: '/service-mesh',
    tenxIcon: 'lift-card',
    name: '治理-服务网格',
    children: [
      {
        key: 'k1',
        to: '/service-mesh',
        tenxIcon: 'topology',
        name: '微服务拓扑',
      }, {
        key: 'k-mesh-gateway',
        to: '/service-mesh/mesh-gateway',
        tenxIcon: 'gateway-o',
        name: '网关',
      }, {
        key: 'k2',
        to: '/service-mesh/component-management',
        tenxIcon: 'puzzle-o',
        name: '组件管理',
      }, {
        key: 'k3',
        to: '/service-mesh/routes-management',
        tenxIcon: 'routing-manage',
        name: '路由管理',
      },
    ],
  },
  {
    key: 'dubbo',
    to: '/dubbo',
    tenxIcon: 'dubbo',
    name: '治理-Dubbo',
    children: [
      {
        key: 'dubbo-list',
        to: '/dubbo/dubbo-manage',
        tenxIcon: 'dubbo',
        name: 'Dubbo 服务列表',
      },
    ],
  },
  {
    key: 'k3',
    to: '/csb-instances',
    icon: 'fork',
    name: '服务总线',
    children: [
      {
        key: 'mine-csb-instances',
        icon: 'user',
        name: '我的实例',
        defaultopen: 'true',
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
        defaultopen: 'true',
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
        tenxIcon: 'apm',
        name: '微服务拓扑',
      }, {
        key: 'k21',
        to: '/apms/performance',
        tenxIcon: 'statistics',
        name: '微服务性能',
      }, {
        key: 'k22',
        to: '/apms/call-link-tracking',
        tenxIcon: 'target',
        name: '调用链路跟踪',
      },
    ],
  }, {
    declare: {
      key: 'projectConfig',
      spread: <Tooltip title="作为某项目的管理员,有权限配置项目相关"><span>项目管理员</span></Tooltip>, // 说明文字 | react Node 展开时渲染
      collapsed: <span className="line"></span>, // 关闭时渲染
    },
    key: 'msa-om',
    to: '/msa-om',
    name: '项目基础安装与运维',
    icon: 'tool',
    children: [
      {
        key: 'k00',
        to: '/setting/msa-config',
        name: '微服务配置',
        tenxIcon: 'msa',
      }, {
        key: 'k01',
        to: '/setting/apms',
        name: 'APM 配置',
        tenxIcon: 'apm',
      }, {
        key: 'k02',
        to: '/msa-om/components',
        name: '微服务组件',
        tenxIcon: 'inject',
      }, {
        key: 'k03',
        to: '/msa-om/log',
        name: '日志查询',
        icon: 'file-text',
      },
    ],
  }, {
    declare: {
      key: 'systemConfig',
      spread: <Tooltip title="作为系统、平台、基础设施管理员,有权限配置系统相关"><span>系统、平台、基础设施管理员</span></Tooltip>, // 说明文字 | react Node
      collapsed: <span className="line"></span>,
    },
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
        to: '/cluster',
        name: 'CSB 运维',
        tenxIcon: 'tools',
        defaultopen: 'true',
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
      },
      //  {
      //   key: 'k11',
      //   to: '/setting/msa-config',
      //   name: '微服务配置',
      //   tenxIcon: 'msa',
      // }, {
      //   key: 'k12',
      //   to: '/setting/apms',
      //   name: 'APM 配置',
      //   tenxIcon: 'apm',
      // },
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
    isShowPoint: false,
  };
  async componentDidMount() {
    this.setState({
      openKeys: this.findSelectedNOpenKeys().openKeys,
    })
    const { loadApply } = this.props
    const query = { flag: 1, page: 1, size: 10, filter: [ 'status-eq-1' ] }
    await loadApply(UNUSED_CLUSTER_ID, query)
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
    const { collapsed } = this.state
    const { user, csbApply } = this.props
    const { children, name, icon, key, to, tenxIcon, declare, ...otherProps } = data
    const isShowPoint = !!user &&
      user.role === ROLE_SYS_ADMIN &&
      !!csbApply && csbApply.ids && csbApply.ids.length > 0
    let iconDOM
    if (icon && (typeof icon === 'string')) iconDOM = <Icon type={icon} />
    if (icon && (typeof icon === 'object')) iconDOM = svgIcon(icon)

    if (tenxIcon && (typeof tenxIcon === 'string')) {
      iconDOM = <TenxIcon
        type={tenxIcon}
        style={{
          marginRight: 10,
          fontSize: 12,
        }} />
    }
    if (children && !declare) {
      return (
        <SubMenu
          key={key}
          title={<span>{iconDOM}
            <span>{name}
            </span>
            {
              data.key === 'k11' && isShowPoint ?
                <span className="topRightPoint"><strong>●</strong></span>
                :
                null
            }
          </span>}
          {...otherProps}
        >
          {
            children.map(item => this.renderMenuItem(item))
          }
        </SubMenu>
      )
    }
    if (children && declare) {
      return (
        <MenuItemGroup title={!collapsed ? declare.spread : declare.collapsed} key={declare.key} >
          <SubMenu
            key={key}
            title={<span>{iconDOM}
              <span>{name}</span>
              {
                data.key === 'k1' && isShowPoint ?
                  <span className="topRightPoint"><strong>●</strong></span>
                  :
                  null
              }
            </span>}
            {...otherProps}
          >
            {
              children.map(item => this.renderMenuItem(item))
            }
          </SubMenu>
        </MenuItemGroup>
      )
    }
    /* let menuItems
    // if (collapsed && to === '') {
    //   menuItems = <Icon type="user" />
    // } else
    if (to !== '/management') {
      menuItems = <Link to={to}>{iconDOM}<span className="nav-text">{name}</span></Link>
    } else if (!collapsed) {
      menuItems =
        <Tooltip placement="right" title={key === 'k4'
          ? '作为某项目的管理员,有权限配置项目相关' : '作为系统管理员,有权限配置系统相关'}>
          <span className="nav-text navFont">{name}</span>
        </Tooltip>
    } else {
      menuItems = <Icon type="user" className="nav-text navFont"/>// <span className="navSolid">{name}</span>
    } */

    return <Menu.Item key={key} {...otherProps}>
      {
        // collapsed && to === '' ?
        //   <Icon type="user" /> :
        <Link to={to}>{iconDOM}
          <span className="nav-text">{name}</span>
          {
            data.key === 'k011' && isShowPoint ?
              <span className="topRightPoint"><strong>●</strong></span>
              :
              null
          }
        </Link>
        // menuItems
      }
    </Menu.Item>
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
        ; (list.length > 0) && (to.indexOf(list[0].to) > -1) && (list[0] = obj)
      }
      return list
    }
    let s = []
    menus.map(menu => finderPath(menu, s))
    ; (s.length > 0) && (s = [ s[0].key ])
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
    const { collapsed, currentUser, managedProjects } = this.props
    const finalMenus = menus.filter(({ key }) => {
      // filter 系统管理员
      if (key === 'k1') {
        return currentUser.role === ROLE_SYS_ADMIN || currentUser.role === ROLE_BASE_ADMIN ||
          currentUser.role === ROLE_PLATFORM_ADMIN
      }
      // filter 项目管理员
      if (key === 'msa-om') {
        return managedProjects.length > 0
      }
      return true
    })
    return (
      <Sider
        style={{ overflow: 'auto', height: '100vh', position: 'fixed' }}
        className="sider-wrapper"
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
      >
        <div className="sider-nav">
          <div className={'logoContainer'}>
            <img
              className={collapsed ? 'logoSmall ' : 'logo'}
              src={collapsed ? '/logo-small.png' : '/logo-wide.png'}
              alt="logo"
            />
          </div>
          {
            <Menu
              style={{ marginTop: 70 }}
              theme="dark"
              mode="inline"
              onOpenChange={this.onOpenChange}
              // onMouseLeave={data => console.log('ddd', data)}
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

const mapStateToProps = state => {
  const { current } = state
  const { user } = current
  const query = { flag: 1, page: 1, size: 10, filter: [ 'status-eq-1' ] }
  const key = getQueryKey(query)
  const csbApply = getDeepValue(state, [ 'CSB', 'myApplication', key ])
  return {
    csbApply,
    user: user.info || {},
  }
}

export default connect(mapStateToProps, {
  loadApply,
})(SiderNav)
