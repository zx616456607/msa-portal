/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Blown monitor demo
 *
 * @author zhangxuan
 * @date 2018-07-12
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd'
import BlownDemo from '../../assets/img/msa-manage/blown-demo.jpg'

export default class BlownDemoModal extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  renderFooter = () => {
    return <Button type={'primary'} onClick={this.toggleVisible}>知道了</Button>
  }

  render() {
    const { visible, onOk, onCancel } = this.props
    return (
      <Modal
        title={'示例图'}
        width={828}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={this.renderFooter()}
      >
        <img src={BlownDemo} alt="blown-demo"/>
      </Modal>
    )
  }
}
