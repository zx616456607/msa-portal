/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Dubbo Component
 *
 * 2018-10-24
 * @author zhouhaitao
 */

import React from 'react'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import DubboList from './DubboList/DubboList'
import DubboDetail from './DubboDetail/DubboDetail'

const dubboChildRoutes = [
  {
    path: '/dubbo/dubbo-manage',
    component: DubboList,
    exact: true,
    key: 'dubbo-manage',
  },
  {
    path: '/dubbo/dubbo-manage/dubbo-detail/:name/:groupVersion',
    component: DubboDetail,
    exact: true,
    key: 'dubbo-detail',
  },
]

class Dubbo extends React.Component {
  renderChildren = () => {
    const { children } = this.props
    // if (!apms || !apms.ids) {
    //   return renderLoading('加载 APM 中 ...')
    // }
    return [
      children,
      <Switch key="switch">
        {
          dubboChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }
  render() {
    return <Layout className="dubbo">
      <Content>
        {this.renderChildren()}
      </Content>
    </Layout>
  }
}
export default Dubbo
