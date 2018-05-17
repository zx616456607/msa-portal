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
import './style/index.less'
import logo from '../../assets/img/logo.svg'
import globalSetting from '../../assets/img/system-settings/global-setting.svg'
import msaconfig from '../../assets/img/msa-manage/msa.svg'
import topologyIcon from '../../assets/img/apm/apm.svg'
import msaComponent from '../../assets/img/msa-om/msa-component.svg'
import csbInstancesOm from '../../assets/img/msa-om/csb-instances-om.svg'

const { Sider } = Layout
const SubMenu = Menu.SubMenu

// const menus = [
//   {
//     path: '/cluster',
//     name: '微服务运维',
//     icon: 'appstore',
//     children: [{
//       path: '/cluster',
//       name: '微服务组件',
//       icon: msaComponent,
//     }, {
//       path: '/cluster',
//       name: 'CSB 运维',
//       icon: csbInstancesOm,
//       children: [
//         {
//           path: '/cluster',
//           name: '实例列表',
//         }, {
//           path: '/cluster',
//           name: '实例审批',
//         }, {
//           path: '/cluster',
//           name: '级联链路规则',
//         },
//       ],
//     }, {
//       path: '/cluster',
//       name: '日志查询',
//       icon: 'file-text',
//     }],
//   },
// ]
const svgIcon = icon => (
  <svg className="itemIcon">
    <use xlinkHref={`#${icon.id}`} />
  </svg>
)
class SiderNav extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = collapsed => {
    this.setState({ collapsed })
  }
  renderMenuItem = data => {
    const { children, name, icon } = data
    if (children) {
      return (
        <SubMenu
          key="sub1"
          title={<span>
            { icon && (typeof icon === 'object') && svgIcon(icon) }
            {
              icon && (typeof icon === 'string') &&
              <Icon type={icon} />
            }
            <span>{name}</span>
          </span>}>
          {
            children.map(item => this.renderMenuItem(item))
          }
        </SubMenu>
      )
    }
    return (
      <Menu.Item key="3">{name}</Menu.Item>
    )
  }
  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
      >
        <svg className={'logo'}>
          <use xlinkHref={`#${logo.id}`} />
        </svg>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[ '1' ]}>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>微服务运维</span></span>}>
            <Menu.Item key="5">
              <svg className="itemIcon">
                <use xlinkHref={`#${msaComponent.id}`} />
              </svg>
              微服务组件</Menu.Item>
            <SubMenu
              key="sub1"
              title={<span>
                <svg className="itemIcon">
                  <use xlinkHref={`#${csbInstancesOm.id}`} />
                </svg>
                <span>CSB 运维</span>
              </span>}>
              <Menu.Item key="3">实例列表</Menu.Item>
              <Menu.Item key="4">实例审批</Menu.Item>
              <Menu.Item key="66">级联链路规则</Menu.Item>
            </SubMenu>
            <Menu.Item key="5">
              <Icon type="file-text" style={{ fontSize: 15 }} />
              日志查询</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" title={<span><Icon type="setting" /><span>系统设置</span></span>}>
            <Menu.Item key="9">
              <svg className="itemIcon">
                <use xlinkHref={`#${globalSetting.id}`} />
              </svg>
              全局配置</Menu.Item>
            <Menu.Item key="10">
              <svg className="itemIcon">
                <use xlinkHref={`#${msaconfig.id}`} />
              </svg>
              微服务配置</Menu.Item>
            <Menu.Item key="11">
              <svg className="itemIcon">
                <use xlinkHref={`#${topologyIcon.id}`} />
              </svg>
              APM 配置</Menu.Item>
          </SubMenu>
          {
            // menus.map(item => this.renderMenuItem(item))
          }
        </Menu>
      </Sider>
    )
  }
}

export default SiderNav
