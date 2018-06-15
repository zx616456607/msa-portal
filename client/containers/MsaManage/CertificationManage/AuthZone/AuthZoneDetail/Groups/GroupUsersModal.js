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

  render() {
    const { visible, onCancel, dataSource, targetKeys, handleChange, loading } = this.props
    return (
      <Modal
        title="管理组用户"
        visible={visible}
        width={660}
        className="modalTransfer"
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={loading}
      >
        <div className="prompt" style={{ backgroundColor: '#fffaf0', borderRadius: 4, border: '1px dashed #ffc125' }}>
          <span>用户加入后，即拥有改组的授权范围中的权限，一个组内同一用户不能被重复添加</span>
        </div>
        <Row className="listTitle">
          <Col span={14}>成员名</Col>
          <Col span={10}>邮箱</Col>
        </Row>
        <Row className="listTitle" style={{ left: 380 }}>
          <Col span={14}>成员名</Col>
          <Col span={10}>邮箱</Col>
        </Row>
        <Transfer
          dataSource={dataSource}
          showSearch
          titles={[ '筛选用户', '已选择用户' ]}
          listStyle={{ width: 250, height: 300 }}
          operations={[ '添加', '移除' ]}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={item => this.renderItem(item)}
          rowKey={record => record.id}
        />
      </Modal>
    )
  }
}
