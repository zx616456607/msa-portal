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
import { Layout } from 'antd'
// import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { Route, Switch, Redirect } from 'react-router-dom'
import './style/index.less'
import GlobalSetting from './GlobalSetting'
import ApmSetting from './Apm'
import MsaConfig from './MsaConfig'

const settingChildRoutes = [
  {
    path: '/setting',
    exact: true,
    render: () => <Redirect to="/setting/global-setting" component={GlobalSetting} />,
    key: 'index',
  },
  {
    path: '/setting/global-setting',
    component: GlobalSetting,
    exact: true,
    key: 'global-setting',
  },
  {
    path: '/setting/msa-config',
    component: MsaConfig,
    exact: true,
    key: 'msa-config',
  },
  {
    path: '/setting/apms',
    component: ApmSetting,
    exact: true,
    key: 'apms',
  },
]

class Setting extends React.Component {
  componentDidMount() {
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
    // const { location } = this.props
    return (
      <Layout className="apm-setting">

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
