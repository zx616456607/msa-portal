/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Header component
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import {
  Layout, Tag,
  Menu, Dropdown, Icon,
} from 'antd'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ROLE_USER, ROLE_SYS_ADMIN, ROLE_BASE_ADMIN, ROLE_PLATFORM_ADMIN } from '../../constants'
import './style/index.less'
import { withNamespaces } from 'react-i18next'
import moment from 'moment'

const LayoutHeader = Layout.Header

@withNamespaces('common')
export default class Header extends React.Component {
  state = {
    language: this.props.i18n.language,
  }

  momentLocale = language => {
    if (language === 'en') {
      moment.locale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: '%d s',
          m: 'a min',
          mm: '%d min',
          h: '1 h',
          hh: '%d h',
          d: 'a day',
          dd: '%d days',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years',
        },
      })
      return
    }
    moment.locale('zh-cn')
  }

  componentDidMount() {
    this.momentLocale(this.state.language)
  }

  changeLanguage = language => {
    this.props.i18n.changeLanguage(language)
    this.setState({ language })
    this.momentLocale(language)
    this.props.forceUpdateApp()
  }

  render() {
    const {
      currentUser, t,
    } = this.props

    const { children, collapsed } = this.props
    const { language } = this.state
    const containerStyles = classNames({
      'layout-header': true,
      'width-wide': collapsed,
      'width-small': !collapsed,
      'layout-border': true,
    })
    const roleName = role => {
      switch (role) {
        case ROLE_SYS_ADMIN:
          return t('header.sysAdmin')
        case ROLE_PLATFORM_ADMIN:
          return t('header.platformAdmin')
        case ROLE_BASE_ADMIN:
          return t('header.baseAdmin')
        case ROLE_USER:
          return t('header.commonUser')
        default:
          break
      }
    }
    return (
      <LayoutHeader className={containerStyles}>
        {children}
        {/* <div/>作为占位符, 当children不存在时, 防止name跑到左侧 */}
        <div />
        <div className="user-panel-trigger userBtn">
          <div
            className="language"
            onClick={() => this.changeLanguage(language === 'zh-CN' ? 'en' : 'zh-CN')}
          >
            { language === 'zh-CN' ? 'EN' : '中文' }
          </div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="apm-setting">
                  <Link to="/setting/apms">
                    {t('header.apmConfig')}
                  </Link>
                </Menu.Item>
                <Menu.Item key="test2">
                  <Link to="/setting/msa-config">
                    {t('header.msaConfig')}
                  </Link>
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            {/* <div>
              <a className="ant-dropdown-link">
                {currentUser.userName || '...'}
              </a>
              <span className="role">系统管理员</span>
              <Icon type="down" />
            </div> */}
            {/* <div className="user-panel-trigger userBtn"> */}
            <div className="userObj">
              <div className="userBtnText">
                <div className="ant-dropdown-link">{currentUser.userName || '...'}</div>
                <div>
                  <Tag>
                    {
                      roleName(currentUser.role)
                    }
                  </Tag>
                </div>
              </div>
              <div className="userBtnIcon">
                <Icon type="down" />
              </div>
            </div>
            {/* </div> */}
          </Dropdown>
        </div>
      </LayoutHeader>
    )
  }
}
