import React from 'react'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { Icon, Switch, Modal, Spin } from 'antd'
import { connect } from 'react-redux'
import { getServiceDemoteStatus, getDemoteStatus, demoteSwitch } from '../../../../../actions/msa'
import './style/index.less'

@connect(state => {
  const clusterID = state.current.config.cluster.id
  return { clusterID }
}, {
  getServiceDemoteStatus,
  getDemoteStatus,
  demoteSwitch,
})
class MsaDetailDemote extends React.Component {
  state = {
    modalShow: false,
    title: '开启降级策略',
    switchChecked: false,
    switchLoading: false,
    demoteEnabled: false,
    loading: false,
  }
  componentDidMount = async () => {
    const { getServiceDemoteStatus,
      getDemoteStatus,
      serviceName,
      instances,
      clusterID } = this.props
    this.setState({ loading: true })
    const result = await getServiceDemoteStatus(clusterID, `${serviceName}:${instances[0].port}`)
    const statusResult = await getDemoteStatus(clusterID, serviceName)
    if (!statusResult.error) {
      this.setState({
        switchChecked: statusResult.response.result.data,
      })
    }
    this.setState({ loading: false })
    if (!result.error) {
      this.setState({ demoteEnabled: result.response.result.data })
    }
  }
  confirmSwitch = async () => {
    const { serviceName, clusterID, demoteSwitch } = this.props
    this.setState({ switchLoading: true })
    const result = await demoteSwitch(clusterID, {
      open: !this.state.switchChecked, serviceName })
    if (!result.error) {
      this.setState({
        modalShow: false,
        switchLoading: false,
        switchChecked: !this.state.switchChecked,
      })
    }
  }
  render() {
    const { demoteEnabled, loading } = this.state
    return <div className="msa-detail-demote">
      {
        loading ?
          <div className="loading">
            <Spin />
          </div>
          :
          <div>
            {
              demoteEnabled ?
                <div className="alert">
                  <TenxIcon type="tips"/>
                  开启后，服务本身的降级策略生效，直到关闭策略；若服务本身未设置降级策略，开关不生效
                </div>
                :
                <div className="alert warning">
                  <TenxIcon type="warning"/>
                  服务未配置降级功能，暂不支持降级操作
                </div>

            }
            {
              demoteEnabled &&
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={this.state.switchChecked}
                  onChange={val => {
                    this.setState({
                      modalShow: true,
                      title: val ? '开启降级策略' : '关闭降级策略',
                    })
                  }}
                />
            }

          </div>
      }
      <Modal
        visible={this.state.modalShow}
        title={this.state.title}
        onOk={this.confirmSwitch}
        onCancel={() => this.setState({ modalShow: false })}
        confirmLoading={this.state.switchLoading}
      >
        <div className="msa-detail-demote-modal">
          <Icon type="question-circle" theme="outlined" />
          是否确定{this.state.title}
        </div>
      </Modal>
    </div>
  }
}

export default MsaDetailDemote
