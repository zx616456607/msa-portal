import React from 'react'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { Icon, Switch, Modal } from 'antd'
import './style/index.less'
class MsaDetailDemote extends React.Component {
  state = {
    modalShow: false,
    title: '开启降级策略',
    switchChecked: false,
  }
  confirmSwitch = () => {
    this.setState({
      modalShow: false,
      switchChecked: !this.state.switchChecked,
    })
  }
  render() {
    return <div className="msa-detail-demote">
      <div className="alert">
        <TenxIcon type="tips"/>
        开启后，服务本身的降级策略生效，直到关闭策略；若服务本身未设置降级策略，开关不生效
      </div>
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
      <Modal
        visible={this.state.modalShow}
        title={this.state.title}
        onOk={this.confirmSwitch}
        onCancel={() => this.setState({ modalShow: false })}
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
