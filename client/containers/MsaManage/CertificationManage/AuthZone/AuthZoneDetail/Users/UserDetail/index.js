/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Zone user detail
 *
 * @author zhangxuan
 * @date 2018-06-07
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Menu, Dropdown, Tabs } from 'antd'
import './style/index.less'
import ICON from '../../../../../../../assets/img/msa-manage/zone-user.png'
import { formatDate } from '../../../../../../../common/utils'
import { patchZoneUser } from '../../../../../../../actions/certification'
import PasswordModal from './PasswordModal'
import UserGroups from './UserGroups'
import Approvals from './Approvals'

const TabPane = Tabs.TabPane

class UserDetail extends React.Component {

  state = {}

  togglePasswordModal = () => {
    this.setState(preState => {
      return {
        passwordVisible: !preState.passwordVisible,
      }
    })
  }

  handleMenu = (e, record) => {
    const { propsFunc } = this.props
    const { handleClick } = propsFunc
    switch (e.key) {
      case 'edit':
        handleClick(e, record)
        break
      case 'password':
        this.togglePasswordModal()
        break
      default:
        break
    }
  }

  renderDropdown = () => {
    const { detail, propsFunc } = this.props
    const { toggleActive } = propsFunc
    const menu = (
      <Menu onClick={e => this.handleMenu(e, detail)} style={{ width: 88 }}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="password" >修改密码</Menu.Item>
      </Menu>
    )
    return (
      <Dropdown.Button overlay={menu} onClick={() => toggleActive(detail)}>
        { detail.active ? '停用' : '启用'}
      </Dropdown.Button>
    )
  }

  render() {
    const { passwordVisible } = this.state
    const { detail } = this.props
    return (
      <div className="zone-user-detail">
        <div className="zone-user-detail-header">
          <div className="zone-user-detail-header-icon">
            <img src={ICON} alt="zone-user"/>
          </div>
          <div className="zone-user-detail-header-right">
            <h2 className="txt-of-ellipsis">
              用户ID：{detail.id}
            </h2>
            <Row>
              <Col span={9}>
                <div className="zone-user-info">用户名：{detail.userName}</div>
                <div className="zone-user-info">
                  邮箱：{detail.emails[0].value}
                  <span className={detail.verified ? 'success-status' : 'error-status'}>
                   （{detail.verified ? '已验证' : '未验证'}）
                  </span>
                </div>
              </Col>
              <Col span={9}>
                <div className="zone-user-info">状态：
                  <span className={detail.verified ? 'success-status' : 'error-status'}>
                    {detail.active ? '可用' : '不可用'}
                  </span>
                </div>
                <div className="zone-user-info">创建时间：{formatDate(detail.meta.created)}</div>
              </Col>
              <Col span={6}>
                {this.renderDropdown()}
              </Col>
            </Row>
          </div>
        </div>
        <div className="zone-user-detail-body">
          <Tabs
            tabPosition="left"
          >
            <TabPane tab="所属组" key="groups">
              <UserGroups
                {...{ detail }}
              />
            </TabPane>
            <TabPane tab="授权记录" key="approvals">
              <Approvals
                {...{ detail }}
              />
            </TabPane>
          </Tabs>
        </div>
        {
          passwordVisible &&
            <PasswordModal
              detail={detail}
              visible={passwordVisible}
              closeModal={this.togglePasswordModal}
            />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { uaaZoneUsers } = state.entities
  return {
    detail: uaaZoneUsers[props.userId],
  }
}

export default connect(mapStateToProps, {
  patchZoneUser,
})(UserDetail)
