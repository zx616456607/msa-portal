/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CallLinkTracking container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT, API_CONFIG } from '../../constants'
import { toQuerystring } from '../../common/utils'
import './style/CallLinkTracking.less'

class CallLinkTracking extends React.Component {
  render() {
    const { currentConfig, currentUser } = this.props
    const query = {
      clusterId: currentConfig.cluster.id,
      namespace: currentUser.namespace,
    }
    const iframeSrc = `${API_CONFIG.MSA_API}/zipkin/?${toQuerystring(query)}`
    return (
      <QueueAnim className="msa-call-link-tracking">
        <div className="layout-content-body" key="body">
          <Card>
            <iframe src={iframeSrc} />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const currentConfig = current.config
  const currentUser = current.user.info
  if (currentConfig.project.namespace === DEFAULT) {
    currentConfig.project.namespace = currentUser.namespace
  }
  return {
    currentConfig,
    currentUser,
  }
}

export default connect(mapStateToProps, {
  //
})(CallLinkTracking)
