/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Group users modal
 *
 * @author zhangxuan
 * @date 2018-06-15
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Transfer, Row, Col, Tooltip } from 'antd'
import { withNamespaces } from 'react-i18next'

@withNamespaces('authZoneDetail')
export default class GroupUsersModal extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    dataSource: PropTypes.array.isRequired,
    targetKeys: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  }

  handleOk = () => {
    const { onOk } = this.props
    onOk()
  }

  renderItem = item => {
    return (
      <Row key={`${item.userName}`}>
        <Col span={12} className="txt-of-ellipsis" style={{ width: '40%' }}>
          <Tooltip title={item.userName}>{item.userName}</Tooltip>
        </Col>
        <Col span={12} className="txt-of-ellipsis" style={{ width: '50%' }}>
          <Tooltip title={item.emails[0].value}>{item.emails[0].value}</Tooltip>
        </Col>
      </Row>
    )
  }

  filterOption = (inputValue, option) => {
    return option.userName.includes(inputValue)
  }

  render() {
    const { visible, onCancel, dataSource, targetKeys, handleChange, loading, t } = this.props
    return (
      <Modal
        title={t('tabGroup.manageGroupUser')}
        visible={visible}
        width={660}
        className="modalTransfer"
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={loading}
        okText={t('public.confirm')}
        cancelText={t('public.cancel')}
      >
        <div className="prompt" style={{ backgroundColor: '#fffaf0', borderRadius: 4, border: '1px dashed #ffc125' }}>
          <span>{t('groupDetail.tip')}</span>
        </div>
        <Row className="listTitle">
          <Col span={14}>{t('groupDetail.membersName')}</Col>
          <Col span={10}>{t('groupDetail.email')}</Col>
        </Row>
        <Row className="listTitle" style={{ left: 380 }}>
          <Col span={14}>{t('groupDetail.membersName')}</Col>
          <Col span={10}>{t('groupDetail.email')}</Col>
        </Row>
        <Transfer
          dataSource={dataSource}
          showSearch
          filterOption={this.filterOption}
          titles={[ t('groupDetail.filterUser'), t('groupDetail.selectedUser') ]}
          listStyle={{ width: 250, height: 300 }}
          operations={[ t('groupDetail.add'), t('groupDetail.remove') ]}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={item => this.renderItem(item)}
          rowKey={record => record.id}
          locale={{ searchPlaceholder: t('groupDetail.searchPlaceHolder') }}
        />
      </Modal>
    )
  }
}
