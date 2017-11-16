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
import { parse } from 'query-string'
import QueueAnim from 'rc-queue-anim'
import { putCenterConfig, getCenterConfig, getService, getBranchList, releaseConfigService, addCenterConfig } from '../../../../actions/configCenter'
import YamlEditor from '../../../../components/Editor/Yaml'
import { Row, Button, Select, Input, notification, Col, Card, Form } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
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
    const { detal } = parse(location.search)
    this.setState({
      detal,
    })
    this.version()
  }

  version = () => {
    const { branch, detal } = parse(location.search)
    const { getService, getBranchList, clusterID } = this.props
    getService(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const url = res.response.result.data.configGitUrl
        this.setState({
          branchName: branch,
          configGitUrl: url,
        })
        if (detal === 'true') {
          this.fetchYaml(branch, url)
        }
        const branchQuery = {
          project_url: url,
        }
        getBranchList(clusterID, branchQuery).then(res => {
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

  fetchYaml = (branch, url) => {
    const { getCenterConfig, clusterID } = this.props
    const { id } = parse(location.search)
    const query = {
      file_path: this.props.location.pathname.split('/')[3],
      branch_name: branch,
      project_url: url,
    }
    getCenterConfig(clusterID, id, query).then(res => {
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
      branch_name: branchName,
      file_path: inputValue === '' ? this.props.location.pathname.split('/')[3] : inputValue,
      commit_message: textAreaValue === '' ? '添加一个配置' : textAreaValue,
      project_url: configGitUrl,
    }
    const yamls = currentYaml === '' ? yaml : currentYaml
    this.props.form.validateFields(err => {
      if (err) return
      putCenterConfig(clusterID, yamls, query).then(res => {
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
        notification.success({
          message: '发布成功',
        })
        this.props.history.push('/msa-manage/config-center')
      }
    })
  }

  handleAdd = () => {
    const { currentYaml, branchName, inputValue, textAreaValue, configGitUrl } = this.state
    const { addCenterConfig, clusterID } = this.props
    this.props.form.validateFields(err => {
      if (err) return
      const query = {
        branch_name: branchName,
        file_path: inputValue,
        commit_message: textAreaValue,
        project_url: configGitUrl,
      }
      addCenterConfig(clusterID, currentYaml, query).then(res => {
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
          this.props.history.push('/msa-manage/config-center')
        }
      })
    })
  }

  render() {
    const { detal, yaml, branchData, btnVasible, currentYaml, branchName } = this.state
    // const defaultValue = branchData[0] !== undefined ? branchData[0].name : ''
    const projectName = this.props.location.pathname.split('/')[3]
    const { getFieldDecorator } = this.props.form

    return (
      <QueueAnim className="create">
        <Card className="info" key="body">
          <Row className="connent">
            <Col className="text" span={4}>配置名称</Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator('configName', {
                  initialValue: detal === 'true' ? projectName : undefined,
                  rules: [{ required: true, message: '请填写配置名称' }],
                })(
                  <Input style={{ width: '60%', margin: '10px' }} onChange={this.handleInput} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className="connent">
            <Col className="text" span={4}>配置版本</Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator('configEdition', {
                  initialValue: branchName,
                  rules: [{ required: true, message: '请选择配置版本' }],
                })(
                  <Select style={{ width: '60%', margin: '10px' }} onChange={this.handlechage}>
                    {
                      branchData ?
                        branchData.map((item, index) => (
                          <Option key={index} value={item.name}>{item.name}</Option>
                        )) : ''
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className="connent">
            <Col className="text" span={4}>配置内容</Col>
            <Col span={20}>
              <YamlEditor style={{ width: '60%' }} value={currentYaml === '' ? yaml : currentYaml} onChange={this.handleYamlEditor} />
            </Col>
          </Row>
          <Row className="connents">
            <Col className="text" span={4}>添加备注</Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator('area', {
                  rules: [{ required: true, message: '请填写备注信息' }],
                })(
                  <TextArea className="textArea" placeholder="添加备注信息" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: '60%' }} onChange={this.handleTextArea} />
                )}
              </FormItem>
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
      </QueueAnim>
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
})(Form.create()(CreateConfig))
