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
import { Popover, Icon } from 'antd'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import CPU from './CPU'
import Memory from './Memory'
import Network from './Network'
import Disk from './Disk'
import TimeControl from './TimeControl'
import './style/index.less'
import SelectWithCheckbox from '@tenx-ui/select-with-checkbox'
import '@tenx-ui/select-with-checkbox/assets/index.css'
import {
  METRICS_CPU, METRICS_MEMORY, METRICS_NETWORK_RECEIVED,
  METRICS_NETWORK_TRANSMITTED, METRICS_DISK_READ, METRICS_DISK_WRITE,
} from '../../constants'

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

  state = {
    checkedKeys: [],
  }

  componentDidMount() {
    this.setInstanceShow(this.props, true)
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps
    if (!isEqual(dataSource, this.props.dataSource)) {
      this.setInstanceShow(nextProps)
    }
  }

  setInstanceShow = (props, isFirst) => {
    const { dataSource } = props
    const { data } = dataSource[METRICS_CPU]
    if (!isEmpty(data)) {
      const containers = data.map(_item => ({ name: _item.container_name }))
      this.setState({
        containers,
      })
      if (isFirst) {
        this.setState({
          filterContainers: containers,
        })
        const checkedContainers = containers.length > 10 ? containers.slice(0, 10) : containers
        const checkedKeys = checkedContainers.map(_item => _item.name)
        this.setState({
          checkedKeys,
        })
      }
    }
  }

  filterDataSource = (data, type) => {
    const { checkedKeys } = this.state
    const copyData = cloneDeep(data)
    const metricTypes = []
    switch (type) {
      case 'cpu':
        metricTypes.push(METRICS_CPU)
        break
      case 'memory':
        metricTypes.push(METRICS_MEMORY)
        break
      case 'network':
        metricTypes.push(METRICS_NETWORK_RECEIVED, METRICS_NETWORK_TRANSMITTED)
        break
      case 'disk':
        metricTypes.push(METRICS_DISK_READ, METRICS_DISK_WRITE)
        break
      default:
        break
    }
    const filterValue = metricTypes
      .map(_type => ({ [_type]: copyData[_type] }))
      .map(_item => {
        const [ currentMetric ] = Object.entries(_item)
        const [ metricType, value ] = currentMetric
        const filterMetricData = value && value.data
          .filter(_data => checkedKeys.includes(_data.container_name))
        return {
          [metricType]: {
            ...value,
            data: filterMetricData,
          },
        }
      })
    const filterObj = {}
    filterValue.forEach(_item => Object.assign(filterObj, _item))
    return { ...data, ...filterObj }
  }

  getRealTimeCheckByType = type => {
    const { realTimeChecked } = this.props
    return realTimeChecked && realTimeChecked[type]
  }

  getDataSourceByType = type => {
    const { dataSource, realTimeDataSource } = this.props
    const _currentData = this.getRealTimeCheckByType(type) ? realTimeDataSource : dataSource
    return this.filterDataSource(_currentData, type)
  }

  getLoadingByType = type => {
    const { realTimeLoading, loading } = this.props
    return this.getRealTimeCheckByType(type) ? realTimeLoading[type] : loading
  }

  toggleVisible = () => {
    this.setState(({ visible }) => ({
      visible: !visible,
    }))
  }

  renderContent = () => {
    const { checkedKeys, value, filterContainers } = this.state
    return <SelectWithCheckbox
      dataSource={filterContainers}
      nameKey={'name'}
      checkedKeys={checkedKeys}
      value={value}
      onChange={this.monitorFilterOnChange}
      onCheck={this.monitorFilterOnSelect}
      onOk={this.monitorFilterConfirm}
      onReset={this.monitorFilterReset}
    />
  }

  monitorFilterOnChange = value => {
    const { containers } = this.state
    this.setState({
      value,
      filterContainers: containers.filter(_item => _item.name.includes(value)),
    })
  }

  monitorFilterOnSelect = item => {
    const { checkedKeys } = this.state
    const keys = new Set(checkedKeys)
    if (keys.has(item.name)) {
      keys.delete(item.name)
    } else {
      keys.add(item.name)
    }
    this.setState({
      checkedKeys: [ ...keys ],
    })
  }

  monitorFilterConfirm = () => {
    this.setState({
      visible: false,
    })
  }

  monitorFilterReset = () => {
    this.setState({
      checkedKeys: [],
    })
  }

  render() {
    const { checkedKeys, visible } = this.state
    const { value, onChange, handleSwitch, freshInterval } = this.props
    return (
      <div id="metric-component">
        <div className="control-box">
          <Popover
            content={this.renderContent()}
            placement={'bottom'}
            trigger={'click'}
            visible={visible}
            overlayClassName="monitor-filter-content"
            onVisibleChange={this.toggleVisible}
            getTooltipContainer={() => document.getElementsByClassName('control-box')[0]}
          >
            <span className="theme-color pointer instance-filter">
              <Icon type="filter" /> <span>筛选实例（已选 {checkedKeys.length}）</span>
            </span>
          </Popover>
          <div className="time-control">
            <TimeControl
              value={value}
              onChange={onChange}
            />
          </div>
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
