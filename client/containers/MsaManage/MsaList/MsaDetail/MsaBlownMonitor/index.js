/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Msa blown monitor
 *
 * @author zhangxuan
 * @date 2018-07-12
 */
import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import BlownChart from '../../../../../components/BlownChart'
import './style/index.less'
import BlownDemoModal from '../../../../../components/BlownChart/BlownDemo'

class MsaBlownMonitor extends React.PureComponent {

  state = {}

  toggleVisible = () => {
    this.setState(({ visible }) => {
      return {
        visible: !visible,
      }
    })
  }

  render() {
    const { visible } = this.state
    return (
      <div className="msa-blown-monitor">
        <span className="primary-color pointer" onClick={this.toggleVisible}>
          <Icon type="picture" /> 查看示例图
        </span>
        <div className="layout-content-body">
          <div className="monitor-wrapper">
            <div className="monitor-list">
              <BlownChart/>
            </div>
          </div>
        </div>
        <BlownDemoModal
          visible={visible}
          onCancel={this.toggleVisible}
          onOk={this.toggleVisible}
        />
      </div>
    )
  }
}

export default connect(null)(MsaBlownMonitor)
