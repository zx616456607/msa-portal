/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Setting container
 *
 * 2017-09-06
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Card } from 'antd'
import { Link } from 'react-router-dom'
import Sider from '../../components/Sider'
import { Route, Switch } from 'react-router-dom'
import { settingChildRoutes } from '../../RoutesDom'
import { getDefaultSelectedKeys } from '../../common/utils'
import topologyIcon from '../../assets/img/apm/topology.svg'
import './style/index.less'

const { Content } = Layout
const menus = [
  {
    to: '/setting/apms',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={topologyIcon.url} />
      </svg>
    ),
    text: 'APM 配置',
  },
]

class Setting extends React.Component {
  componentWillMount() {
    //
  }

  // renderLoading = tip => (
  //   <div className="loading">
  //     <Spin size="large" tip={tip} />
  //   </div>
  // )

  renderChildren = () => {
    const { children } = this.props
    // if (!apms || !apms.ids) {
    //   return this.renderLoading('加载 APM 中 ...')
    // }
    return [
      children,
      <Switch key="switch">
        {
          settingChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const { location } = this.props
    return (
      <Layout className="apm-setting">
        <Sider>
          <Card
            className="left-menu-card"
            noHovering={false}
          >
            <Menu mode="inline"
              defaultSelectedKeys={getDefaultSelectedKeys(location, menus)}
            >
              {
                menus.map(menu => (
                  <Menu.Item key={menu.to}>
                    <Link to={menu.to}>
                      {menu.icon}
                      <span className="nav-text">{menu.text}</span>
                    </Link>
                  </Menu.Item>
                ))
              }
            </Menu>
          </Card>
        </Sider>
        <Content className="layout-content">
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = () => ({
  //
})

export default connect(mapStateToProps, {
  //
})(Setting)
