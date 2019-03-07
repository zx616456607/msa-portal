/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * ApiGateWay Index page
 *
 * @author ZhouHaitao
 * @date 2019-03-26 10:42
 */
import * as React from 'react'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import ApiManage from './ApiManage'
import ApiManageEdit from './ApiManage/ApiManageEdit'
import ApiDetail from './ApiManage/ApiDetail'

const apiGateWayChildRoutes = [
  {
    path: '/api-gateway',
    component: ApiManage,
    exact: true,
    key: 'api-gateway',
  },
  {
    path: '/api-gateway/api-manage-edit',
    component: ApiManageEdit,
    exact: true,
    key: 'api-gateway-edit',
  },
  {
    path: '/api-gateway/api-detail',
    component: ApiDetail,
    exact: true,
    key: 'api-gateway-edit',
  },
]

interface ApiGateWayProps {
  children: object
}

class ApiGateWay extends React.Component<ApiGateWayProps> {

  renderChildren = () => {
    const { children } = this.props

    return [
      children,
      <Switch key="switch">
        {
          apiGateWayChildRoutes.map(routeProps => <Route key={routeProps.path} {...routeProps} />)}
      </Switch>,
    ]
  }

  render() {
    return <Layout className="api-gateway-index">
      <Content>
        {this.renderChildren()}
      </Content>
    </Layout>
  }
}

export default ApiGateWay
