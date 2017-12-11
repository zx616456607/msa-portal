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
import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { settingChildRoutes } from '../../RoutesDom'
import { getMenuSelectedKeys } from '../../common/utils'
import { renderMenu } from '../../components/utils'
import topologyIcon from '../../assets/img/apm/apm.svg'
import msaconfig from '../../assets/img/msa-manage/msa.svg'
import globalSetting from '../../assets/img/system-settings/global-setting.svg'
import './style/index.less'

const menus = [
  {
    to: '/setting/global-setting',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={`#${globalSetting.id}`} />
      </svg>
    ),
    text: '全局配置',
  }, {
    to: '/setting/msa-config',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={`#${msaconfig.id}`} />
      </svg>
    ),
    text: '微服务配置',
  }, {
    to: '/setting/apms',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={`#${topologyIcon.id}`} />
      </svg>
    ),
    text: 'APM 配置',
  },
]

class Setting extends React.Component {
  componentWillMount() {
    //
  }

  renderChildren = () => {
    const { children } = this.props
    // if (!apms || !apms.ids) {
    //   return renderLoading('加载 APM 中 ...')
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
        <Sider extra={false}>
          <Card
            className="left-menu-card"
            hoverable={false}
            title="系统设置"
          >
            <Menu mode="inline"
              defaultSelectedKeys={getMenuSelectedKeys(location, menus)}
            >
              {
                menus.map(renderMenu)
              }
            </Menu>
          </Card>
        </Sider>
        <Content>
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
