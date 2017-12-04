import React from 'react'
import { Link } from 'react-router-dom'

export default class InstanceDetailOverview extends React.Component {
  render() {
    const { match } = this.props
    const { instanceID } = match.params
    return (
      <div>
        <h1>概览</h1>
        <Link to={`/csb-instances-available/${instanceID}/publish-service`}>发布服务</Link>
      </div>
    )
  }
}
