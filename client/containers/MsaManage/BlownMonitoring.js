import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Icon, Select } from 'antd'
import './style/BlownMonitoring.less'
import BlownChart from '../../components/BlownChart'
import ThreadChart from '../../components/BlownChart/ThreadChart'

const Option = Select.Option


class BlownMonitoring extends React.Component {

  render() {
    return (
      <QueueAnim className="blown-monitoring">
        <div className="layout-content-btns" key={'btns'}>
          <Select
            placeholder={'服务监控组（默认）'}
            style={{ width: 200 }}>
            <Option key={'default'}>default</Option>
          </Select>
          <span className={'primary-color pointer'}><Icon type="picture" /> 查看示例图</span>
        </div>
        <div className="layout-content-body" key="body">
          <div className="first-title">断路器</div>
          <div className="monitor-wrapper">
            <div className="monitor-list">
              <BlownChart/>
            </div>
          </div>
          <div className="first-title">线程池</div>
          <div className="monitor-wrapper">
            <div className="monitor-list">
              <ThreadChart/>
            </div>
          </div>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = () => {
  return {

  }
}

export default connect(mapStateToProps, {

})(BlownMonitoring)
