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
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import DistributedList from './DistributedList'
import ExecutionRecord from './ExecutionRecord'
import * as SpingCloudActions from '../../actions/msaConfig'
import { checkSpringCloudInstall } from '../MsaManage';
import { renderLoading } from '../../components/utils'
import DistributedImg from '../../assets/img/distributed/distributed.png'

const distributeChildRoutes = [
  {
    path: '/distribute/list',
    component: DistributedList,
    key: 'distribute-list',
  },
  {
    path: '/distribute/distribute-record',
    exact: true,
    component: ExecutionRecord,
    key: 'distribute-record',
  },
]


class Distributed extends React.Component {
  state = {
    isDeployed: false,
    loading: true,
  }

  componentDidMount() {
    const { current, fetchSpingCloud } = this.props
    const clusterID = current.config.cluster.id
    fetchSpingCloud(clusterID).then(res => {
      this.setState({
        isDeployed: checkSpringCloudInstall(res, current),
        loading: false,
      })
    })
  }

  renderChildren = () => {
    const { children } = this.props
    const { isDeployed, loading } = this.state
    if (loading) {
      return renderLoading('加载 SpingCloud 中 ...')
    }
    if (!isDeployed) {
      return <div className="loading">
        <img alt="distribute-not-enabled" src={DistributedImg} />
        <div>当前项目对应的集群，未安装分布式事务基础服务组件</div>
        <div>请『联系系统管理员』安装</div>
      </div>
    }
    return [
      children,
      <Switch key="switch">
        {
          distributeChildRoutes.map(routeProps => <Route {...routeProps} />)
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
const mapStateToProps = state => {
  const { current } = state
  return {
    auth: state.entities.auth,
    current: current || {},
  }
}

export default connect(mapStateToProps, {
  fetchSpingCloud: SpingCloudActions.fetchSpingCloud,
})(Distributed)

