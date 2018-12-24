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
import { withNamespaces } from 'react-i18next'

@withNamespaces('blownMonitor')
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
    const { onOk, t } = this.props
    return <Button type={'primary'} onClick={onOk}>{t('blownMonitor.gotIt')}</Button>
  }

  render() {
    const { visible, onOk, onCancel, t } = this.props
    return (
      <Modal
        title={t('blownMonitor.sample')}
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
