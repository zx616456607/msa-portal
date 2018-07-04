/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Metrics component
 *
 * @author zhangxuan
 * @date 2018-07-04
 */
import React from 'react'
import PropTypes from 'prop-types'
import CPU from './CPU'
import Memory from './Memory'
import Network from './Network'
import Disk from './Disk'
import TimeControl from './TimeControl'
import './style/index.less'

export default class Metric extends React.PureComponent {
  static propTypes = {
    value: PropTypes.oneOf([ '1', '6', '24', '168', '720' ]).isRequired,
    onChange: PropTypes.func.isRequired,
    dataSource: PropTypes.object,
    realTimeDataSource: PropTypes.object,
    realTimeChecked: PropTypes.object,
    realTimeLoading: PropTypes.object,
    handleSwitch: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    freshInterval: PropTypes.string.isRequired,
  }

  getRealTimeCheckByType = type => {
    const { realTimeChecked } = this.props
    return realTimeChecked && realTimeChecked[type]
  }

  getDataSourceByType = type => {
    const { dataSource, realTimeDataSource } = this.props
    return this.getRealTimeCheckByType(type) ? realTimeDataSource : dataSource
  }

  getLoadingByType = type => {
    const { realTimeLoading, loading } = this.props
    return this.getRealTimeCheckByType(type) ? realTimeLoading[type] : loading
  }

  render() {
    const { value, onChange, handleSwitch, freshInterval } = this.props
    return (
      <div id="metric-component">
        <div className="time-control-box">
          <TimeControl
            value={value}
            onChange={onChange}
          />
        </div>
        <CPU
          dataSource={this.getDataSourceByType('cpu')}
          checked={this.getRealTimeCheckByType('cpu')}
          loading={this.getLoadingByType('cpu')}
          {...{ handleSwitch, freshInterval }}
        />
        <Memory
          dataSource={this.getDataSourceByType('memory')}
          checked={this.getRealTimeCheckByType('memory')}
          loading={this.getLoadingByType('memory')}
          {...{ handleSwitch, freshInterval }}
        />
        <Network
          dataSource={this.getDataSourceByType('network')}
          checked={this.getRealTimeCheckByType('network')}
          loading={this.getLoadingByType('network')}
          {...{ handleSwitch, freshInterval }}
        />
        <Disk
          dataSource={this.getDataSourceByType('disk')}
          checked={this.getRealTimeCheckByType('disk')}
          loading={this.getLoadingByType('disk')}
          {...{ handleSwitch, freshInterval }}
        />
      </div>
    )
  }
}
