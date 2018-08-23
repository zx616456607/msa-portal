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
import { Route, Switch } from 'react-router-dom'
// import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { msaOmChildRoutes } from '../../RoutesDom'
import { ROLE_SYS_ADMIN } from '../../constants'
// import msaComponent from '../../assets/img/msa-om/msa-component.svg'
// import csbInstancesOm from '../../assets/img/msa-om/csb-instances-om.svg'
// import csbInstancesApproval from '../../assets/img/msa-om/csb-instances-approval.svg'

// const menus = [
//   {
//     to: '/msa-om/components',
//     text: '微服务组件',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${msaComponent.id}`} />
//       </svg>
//     ),
//   },
//   {
//     type: 'SubMenu',
//     text: 'CSB 运维',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${csbInstancesOm.id}`} />
//       </svg>
//     ),
//     key: 'msa-om-csb',
//     children: [
//       {
//         to: '/msa-om/csb-instance-om',
//         text: '实例列表',
//       },
//       {
//         to: '/msa-om/csb-instance-approval',
//         text: '实例审批',
//       },
//       {
//         to: '/msa-om/csb-cascading-link-rules',
//         text: '级联链路规则',
//         includePaths: [
//           '/msa-om/csb-cascading-link-rules/create',
//         ],
//       },
//     ],
//   },
//   /* {
//     to: '/msa-om/csb-instance-om',
//     text: 'CSB 实例运维',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${csbInstancesOm.id}`} />
//       </svg>
//     ),
//   },
//   {
//     to: '/msa-om/csb-instance-approval',
//     text: 'CSB 实例审批',
//     icon: (
//       <svg className="menu-icon">
//         <use xlinkHref={`#${csbInstancesApproval.id}`} />
//       </svg>
//     ),
//   }, */
//   {
//     to: '/msa-om/log',
//     text: '日志查询',
//     icon: <Icon type="file-text" style={{ fontSize: 15 }} />,
//   },
// ]

class MsaOm extends React.Component {
  componentDidMount() {
    const { current, history } = this.props
    if (current.user.info && current.user.info.role !== ROLE_SYS_ADMIN) {
      history.replace('/')
    }
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
