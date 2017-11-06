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
import { putCenterConfig, getCenterConfig, getService, getBranchList, releaseConfigService, addCenterConfig } from '../../../../actions/configCenter'
import YamlEditor from '../../../../components/Editor/Yaml'
import { Row, Button, Select, Input, notification, Col, Card } from 'antd'
const Option = Select.Option
const { TextArea } = Input

class CreateConfig extends React.Component {
  state = {
    yaml: '',
    branchName: '',
    inputValue: '',
    textAreaValue: '',
    btnVasible: true,
    detal: '',
    branchData: [],
    configGitUrl: '',
    currentYaml: '',
  }
  componentWillMount() {
    const isDatail = (this.props.location.hash.split('&')[0]).split('=')[1]
    this.setState({
      detal: isDatail,
    })
    this.version()
    if (isDatail === 'true') {
      this.fetchYaml()
    }
  }

  version = () => {
    const { getService, getBranchList, clusterID } = this.props
    getService(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          configGitUrl: res.response.result.data.configGitUrl,
        })
        const branchQuery = {
          url: res.response.result.data.configGitUrl,
          clusterId: clusterID,
        }
        getBranchList(branchQuery).then(res => {
          if (res.error) return
          if (res.response.result.code === 200) {
            this.setState({
              branchData: res.response.result.data,
            })
          }
        })
      }
    })
  }

  fetchYaml = () => {
    const { getCenterConfig, clusterID } = this.props
    const { configGitUrl } = this.state
    const query = {
      id: /([^=\s]+)=([^=\s]+)/g.exec(this.props.location.hash.split('&')[1])[2],
      url: configGitUrl,
      clusterId: clusterID,
    }
    getCenterConfig(query).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          yaml: res.response.result.data.content,
        })
      }
    })
  }

  handleSaveUpdate = () => {
    const { configGitUrl, branchName, inputValue, textAreaValue, currentYaml, yaml } = this.state
    const { putCenterConfig, clusterID } = this.props
    const query = {
      branchName,
      configName: inputValue === '' ? this.props.location.pathname.split('/')[3] : inputValue,
      message: textAreaValue,
      url: configGitUrl,
      clusterId: clusterID,
      yaml: currentYaml === '' ? yaml : currentYaml,
    }
    putCenterConfig(query).then(res => {
      if (res.error) {
        notification.error({
          message: '保存失败',
        })
        return
      }
      if (res.response.result.code === 200) {
        notification.success({
          message: '保存成功',
        })
        this.setState({
          btnVasible: false,
        })
      }
    })
  }

  handleInput = e => {
    this.setState({
      inputValue: e.target.value,
    })
  }

  handlechage = value => {
    this.setState({
      branchName: value,
    })
  }

  handleTextArea = e => {
    this.setState({
      textAreaValue: e.target.value,
    })
  }

  handleYamlEditor = e => {
    this.setState({
      currentYaml: e,
    })
  }

  handleRelease = () => {
    const { releaseConfigService, clusterID } = this.props
    releaseConfigService(clusterID).then(res => {
      if (res.error) {
        notification.error({
          message: '发布失败',
        })
        return
      }
      if (res.response.status === 200) {
        notification.error({
          message: '发布成功',
        })

      }
    })
  }

  handleAdd = () => {
    const { currentYaml, branchName, inputValue, textAreaValue, configGitUrl } = this.state
    const { addCenterConfig, clusterID } = this.props
    const query = {
      branchName,
      configName: inputValue,
      message: textAreaValue,
      url: configGitUrl,
      clusterId: clusterID,
      yaml: currentYaml,
    }
    addCenterConfig(query).then(res => {
      if (res.error) {
        notification.error({
          message: '添加失败',
        })
        return
      }
      if (res.response.result.code === 200) {
        notification.success({
          message: '添加成功',
        })
      }
    })
  }

  render() {
    const { detal, yaml, branchData, btnVasible } = this.state
    // const defaultValue = branchData[0] !== undefined ? branchData[0].name : ''
    const projectName = this.props.location.pathname.split('/')[3]

    return (
      <Card className="info">
        <Row className="connent">
          <Col className="text" span={4}>配置名称</Col>
          <Col span={20}>
            <Input style={{ width: '60%', margin: '10px' }} defaultValue={detal === 'true' ? projectName : ''} onChange={this.handleInput} />
          </Col>
        </Row>
        <Row className="connent">
          <Col className="text" span={4}>配置版本</Col>
          <Col span={20}>
            <Select style={{ width: '60%', margin: '10px' }} onChange={this.handlechage}>
              {
                branchData ?
                  branchData.map((item, index) => (
                    <Option key={index} value={item.name}>{item.name}</Option>
                  )) : ''
              }
            </Select>
          </Col>
        </Row>
        <Row className="connent">
          <Col className="text" span={4}>配置内容</Col>
          <Col span={20}>
            <YamlEditor style={{ width: '60%' }} value={yaml} onChange={this.handleYamlEditor} />
          </Col>
        </Row>
        <Row className="connents">
          <Col className="text" span={4}>添加备注</Col>
          <Col span={20}>
            <TextArea className="textArea" placeholder="删除一个配置" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: '60%' }} onChange={this.handleTextArea} />
          </Col>
        </Row>
        <div className="operation" >
          {
            detal === 'true' ?
              <div>
                {
                  btnVasible ?
                    <Button className="close" type="primary" onClick={this.handleSaveUpdate}>保存更新</Button> :
                    <Button className="close" onClick={this.handleSaveUpdate}>保存更新</Button>
                }
                <Button className="ok" type="primary" disabled={btnVasible} onClick={this.handleRelease}>发布</Button>
              </div> :
              <div>
                <Button className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>取消</Button>
                <Button className="ok" type="primary" onClick={this.handleAdd}>确认</Button>
              </div>
          }
        </div>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
  }
}

export default connect(mapStateToProps, {
  getService,
  getBranchList,
  addCenterConfig,
  putCenterConfig,
  getCenterConfig,
  releaseConfigService,
})(CreateConfig)
