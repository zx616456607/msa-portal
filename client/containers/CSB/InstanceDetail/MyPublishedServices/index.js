/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Services
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import {
  Radio, Form, Row, Col,
} from 'antd'
import './style/MyPublishedServices.less'
import { parse as parseQuerystring } from 'query-string'
import ServiceGroups from './Groups'
import Services from './Services'
import { getInstanceService } from '../../../../actions/CSB/instanceService'
const RadioGroup = Radio.Group
const FormItem = Form.Item

class MyPublishedServices extends React.Component {
  state = {
    isOff: false,
    showType: '',
  }

  // 是否显示已注销服务
  logoutServiceChange = value => {
    return value
  }

  renderDifferentTable = () => {
    const { form, location, match, history } = this.props
    const { getFieldValue } = form
    const showType = getFieldValue('showType')
    switch (showType) {
      case 'all':
        return <Services
          history={history}
          match={match}
          location={location}
          isOff={this.state.isOff} />
      case 'group':
        return <ServiceGroups history={history} match={match} location={location} />
      default:
        return
    }
  }

  showTypeChange = value => {
    this.setState({
      showType: value,
    })
  }

  render() {
    const { form } = this.props
    const { getFieldValue, getFieldDecorator } = form
    const showType = getFieldValue('showType')
    return (
      <QueueAnim id="my-published-services">
        <div className="showType">
          <Row>
            <Col span="10">
              <FormItem
                label={<span>显示方式：</span>}
                key="showType"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 15 }}
                className="showType"
              >
                {
                  getFieldDecorator('showType', {
                    initialValue: 'all',
                    onChange: this.showTypeChange,
                  })(
                    <RadioGroup>
                      <Radio value="all">显示全部服务</Radio>
                      <Radio value="group">显示服务组</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Col>
            {
              showType === 'all' && <Col span="12">
                <FormItem
                  label={<span>已注销服务：</span>}
                  key="logoutService"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 15 }}
                  className="showType"
                >
                  {
                    getFieldDecorator('logoutService', {
                      initialValue: 'all',
                      onChange: this.logoutServiceChange,
                    })(
                      <RadioGroup>
                        <Radio value="all">不显示</Radio>
                        <Radio value="group">显示</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
            }
          </Row>
        </div>
        {this.renderDifferentTable()}
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { clusters } = entities
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    clusters,
    location,
  }
}

export default connect(mapStateToProps, {
  getInstanceService,
})(Form.create()(MyPublishedServices))

