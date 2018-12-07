/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaOm container
 *
 * 2017-11-10
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { Route, Switch, Redirect } from 'react-router-dom'
// import Sider from '../../components/Sider'
import Content from '../../components/Content'
import MsaOmLogs from './Log'
import MsaComponents from './Components'
import CSBInstanceOm from './CSBInstanceOm'
import MsaOmCSBApproval from './CSBApproval'
import CSBCascadingLinkRules from './CSBCascadingLinkRules'
import CreateLinkRules from './CSBCascadingLinkRules/CreateLinkRules'

const msaOmChildRoutes = [
  {
    path: '/msa-om',
    exact: true,
    render: () => <Redirect to="/msa-om/components" component={MsaComponents} />,
    key: 'index',
  },
  {
    path: '/msa-om/log',
    component: MsaOmLogs,
    exact: true,
    key: 'msa-om-logs',
  },
  {
    path: '/msa-om/components',
    component: MsaComponents,
    exact: true,
    key: 'msa-om-components',
  },
  {
    path: '/msa-om/csb-instance-om',
    component: CSBInstanceOm,
    exact: true,
    key: 'csb-instance-om',
  },
  {
    path: '/msa-om/csb-instance-approval',
    component: MsaOmCSBApproval,
    exact: true,
    key: 'csb-instance-approval',
  },
  {
    path: '/msa-om/csb-cascading-link-rules',
    component: CSBCascadingLinkRules,
    exact: true,
    key: 'csb-cascading-link-rules',
  },
  {
    path: '/msa-om/csb-cascading-link-rules/create',
    component: CreateLinkRules,
    exact: true,
    key: 'csb-cascading-link-rules-create',
  },
]

class MsaOm extends React.Component {
  componentDidMount() {
    // const { current, history } = this.props
    // if (current.user.info && current.user.info.role !== ROLE_SYS_ADMIN) {
    //   history.replace('/')
    // }
  }

  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          msaOmChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    // const { location } = this.props
    // const title = (
    //   <div>
    //     微服务运维
    //   </div>
    // )
    return (
      <Layout className="msa-om">
        <Content key="content">
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const current = state.current || {}
  return {
    current,
  }
}

export default connect(mapStateToProps, {
  //
})(MsaOm)
