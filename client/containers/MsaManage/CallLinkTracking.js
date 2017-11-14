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
import { Card, Button } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT, API_CONFIG } from '../../constants'
import { toQuerystring } from '../../common/utils'
import './style/CallLinkTracking.less'

export function getZipkinSrc(currentConfig, currentUser) {
  const query = {
    clusterId: currentConfig.cluster.id,
    namespace: currentUser.namespace,
  }
  const iframeSrc = `${API_CONFIG.MSA_API}/zipkin/?${toQuerystring(query)}`
  return iframeSrc
}

class CallLinkTracking extends React.Component {
  render() {
    const { currentConfig, currentUser } = this.props
    const iframeSrc = getZipkinSrc(currentConfig, currentUser)
    return (
      <QueueAnim className="msa-call-link-tracking">
        <div className="router-manage-btn-box layout-content-btns" key="btns">
          <Button onClick={() => window.open(iframeSrc)} type="dashed" icon="export">
          新窗口打开
          </Button>
        </div>
        <div className="layout-content-body" key="body">
          <Card noHovering>
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
