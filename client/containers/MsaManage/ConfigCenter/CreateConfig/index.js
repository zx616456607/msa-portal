/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * create-config
 *
 * 2017-09-12
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import YamlEditor from '../../../../components/Editor/Yaml'
import { Row, Button, Select, Input } from 'antd'

class CreateConfig extends React.Component {
  state = {
    detal: false,
  }
  componentWillMount() {
    const hash = this.props.location.hash.split('=')
    this.setState({
      detal: hash[1],
    })
  }
  render() {
    const { detal } = this.state
    return (
      <Row className="layout-content-btns">
        <div className="name" style={{ marginRight: 0 }}>
          <span>配置名称</span>
          <Input className="ipt" />
        </div>
        <div className="version" style={{ marginRight: 0 }}>
          <span>配置版本</span>
          <Select className="sel"></Select>
        </div>
        <div className="connent" style={{ marginRight: 0 }}>
          <div className="text">
            <span>配置内容</span>
          </div>
          <YamlEditor className="yaml" value="kind: Deployment"/>
        </div>
        <div className="operation">
          {
            detal ?
              <div>
                <Button className="close">保存更新</Button>
                <Button className="ok" type="primary">发布</Button>
              </div> :
              <div>
                <Button className="close">取消</Button>
                <Button className="ok" type="primary">确认</Button>
              </div>
          }
        </div>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return { state }
}

export default connect(mapStateToProps, {
})(CreateConfig)
