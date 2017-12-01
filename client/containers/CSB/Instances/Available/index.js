import React from 'react'
import { Link } from 'react-router-dom'

export default class AvailableInstances extends React.Component {
  render() {
    return (
      <div>
        <h1>可用实例</h1>
        <Link to="/csb-instances-available/test-instance">实例详情</Link>
      </div>
    )
  }
}
