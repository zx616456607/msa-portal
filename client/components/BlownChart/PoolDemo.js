/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Pool demo
 *
 * @author zhangxuan
 * @date 2018-11-16
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd'
import PoolDemo from '../../assets/img/msa-manage/pool-demo.jpg'

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
    const { onOk } = this.props
    return <Button type={'primary'} onClick={onOk}>知道了</Button>
  }

  render() {
    const { visible, onOk, onCancel } = this.props
    return (
      <Modal
        title={'示例图'}
        width={628}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={this.renderFooter()}
      >
        <img src={PoolDemo} alt="blown-demo"/>
      </Modal>
    )
  }
}
