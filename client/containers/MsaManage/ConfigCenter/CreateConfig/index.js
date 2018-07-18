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
import { putCenterConfig, getCenterConfig, getService, getBranchList, getCenterEvn, releaseConfigService, addCenterConfig } from '../../../../actions/configCenter'
import YamlEditor from '../../../../components/Editor/Yaml'
import { Row, Button, Select, Input, notification, Card, Form } from 'antd'
import { REPOSITORY_REGEXP } from '../../../../constants'
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
    detail: 'false',
    branchData: [],
    configGitUrl: '',
    currentYaml: '',
    editLoading: false,
    addLoading: false,
    releaseLoading: false,
  }
  componentWillMount() {
    const { location } = this.props
    const { detail } = parse(location.search)
    this.setState({
      detail,
    })
    this.version()
  }

  version = () => {
    const { getService, getBranchList, clusterID, location } = this.props
    const { branch, detail } = parse(location.search)
    getService(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const url = res.response.result.data.configGitUrl
        this.setState({
          branchName: branch,
          configGitUrl: url,
        })
        if (detail === 'true' || detail === 'update') {
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
    const { getCenterConfig, clusterID, location, form } = this.props
    const { id } = parse(location.search)
    const query = {
      file_path: location.pathname.split('/')[3],
      branch_name: branch,
      project_url: url,
    }
    getCenterConfig(clusterID, id, query).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const content = res.response.result.data.content
        form.setFieldsValue({ info: content })
        this.setState({
          yaml: content,
        })
      }
    })
  }

  handleSaveUpdate = () => {
    const { configGitUrl, branchName, inputValue, textAreaValue, currentYaml,
      yaml } = this.state
    const { putCenterConfig, clusterID } = this.props
    const query = {
      branch_name: branchName,
      file_path: inputValue === '' ? this.props.location.pathname.split('/')[3] : inputValue,
      commit_message: textAreaValue === '' ? '添加一个配置' : textAreaValue,
      project_url: configGitUrl,
    }
    const yamls = currentYaml === '' ? yaml : currentYaml
    if (yaml && currentYaml === '') {
      notification.info({
        message: '请填写配置内容',
      })
      return
    }
    this.props.form.validateFields(err => {
      if (err) return
      this.setState({
        editLoading: true,
      })
      putCenterConfig(clusterID, yamls, query).then(res => {
        this.setState({
          editLoading: false,
        })
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
    const { getCenterEvn, clusterID } = this.props
    const { configGitUrl } = this.state
    const evnQuery = {
      project_url: configGitUrl,
      branch_name: value,
    }
    getCenterEvn(clusterID, evnQuery)
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
    const { releaseConfigService, clusterID, history } = this.props
    this.setState({
      releaseLoading: true,
    })
    releaseConfigService(clusterID).then(res => {
      if (res.error) {
        notification.error({
          message: '发布失败',
        })
        this.setState({
          releaseLoading: false,
        })
        return
      }
      if (res.type === 'CENTER_RELEASE_SUCCESS') {
        notification.success({
          message: '发布成功',
        })
        history.push('/msa-manage/config-center')
      }
    })
  }

  handleAdd = () => {
    const { currentYaml, branchName, inputValue, textAreaValue, configGitUrl } = this.state
    const { addCenterConfig, clusterID, history, data } = this.props
    let hasConfigName
    data.every(item => {
      if (item.name === inputValue) {
        hasConfigName = true
        return false
      }
      return true
    })
    if (hasConfigName) {
      notification.info({
        message: '配置名称已存在',
      })
      return
    }
    this.props.form.validateFields(err => {
      if (err) return
      if (currentYaml === '') {
        notification.info({
          message: '请填写配置内容',
        })
        return
      }
      this.setState({
        addLoading: true,
      })
      const query = {
        branch_name: branchName,
        file_path: inputValue,
        commit_message: textAreaValue,
        project_url: configGitUrl,
      }
      addCenterConfig(clusterID, currentYaml, query).then(res => {
        if (res.error) {
          this.setState({
            addLoading: false,
          })
          notification.error({
            message: '添加失败',
          })
          return
        }
        if (res.response.result.code === 200) {
          notification.success({
            message: '添加成功',
          })
          history.push('/msa-manage/config-center')
        }
      })
    })
  }

  render() {
    const { detail, yaml, branchData, btnVasible, currentYaml,
      branchName, addLoading, editLoading, releaseLoading } = this.state
    // const defaultValue = branchData[0] !== undefined ? branchData[0].name : ''
    const projectName = this.props.location.pathname.split('/')[3]
    const { getFieldDecorator } = this.props.form
    const fromLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    const readOnly = {
      readOnly: detail === 'true',
    }
    return (
      <QueueAnim className="create">
        <Card className="info" key="body">
          <Row className="connent">
            <FormItem {...fromLayout} label="配置名称">
              {getFieldDecorator('configName', {
                initialValue: detail !== 'false' ? projectName : undefined,
                rules: [{ required: true, pattern: REPOSITORY_REGEXP, whitespace: true, message: '配置名称可由 2~50 位字母、数字、中划线下划线和点组成，以字母开头' }],
              })(
                <Input className="selects" placeholder="请输入配置名称" disabled={ detail === 'true' } onChange={this.handleInput} />
              )}
            </FormItem>
          </Row>
          <Row className="connent">
            <FormItem {...fromLayout} label="配置版本">
              {getFieldDecorator('edition', {
                initialValue: detail !== 'false' ? branchName : undefined,
                rules: [{ required: true, whitespace: true, message: '请选择配置版本' }],
              })(
                <Select className="selects" placeholder="请选择配置版本" disabled={ detail === 'true' } onChange={this.handlechage}>
                  {
                    branchData ?
                      branchData.map((item, index) => (
                        <Option key={index} value={item.name}>{item.name}</Option>
                      )) : ''
                  }
                </Select>
              )}
            </FormItem>
          </Row>
          <Row className="connent">
            <FormItem {...fromLayout} label="配置内容">
              {getFieldDecorator('info', {
                initialValue: currentYaml === '' ? yaml : currentYaml,
                rules: [{ required: true, whitespace: true, message: '请填写配置内容' }],
              })(
                <YamlEditor options={readOnly} style={{ width: '60%' }} onChange={this.handleYamlEditor} />
              )}
            </FormItem>
          </Row>
          {
            detail !== 'true' ?
              <Row className="connents">
                <FormItem {...fromLayout} label="Commit">
                  {getFieldDecorator('configArea', {
                    rules: [{ required: true, whitespace: true, message: '请填写Commit' }],
                  })(
                    <TextArea className="textArea" placeholder="输入Commit" autosize={{ minRows: 1.5, maxRows: 6 }} onChange={this.handleTextArea} />
                  )}
                </FormItem>
              </Row>
              : null
          }
          <div className="operation" >
            {
              detail === 'update' &&
              <div>
                {
                  btnVasible ?
                    [ <Button key="close" className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>取消</Button>,
                      <Button key="confirm" className="close" type="primary" loading={editLoading} onClick={this.handleSaveUpdate}>保存更新</Button> ]
                    :
                    <Button className="ok" type="primary" loading={releaseLoading} onClick={this.handleRelease}>发布</Button>
                }
              </div>
            }
            {
              detail === 'true' &&
                <div>
                  <Button type="primary" className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>确定</Button>
                </div>
            }
            {
              detail === 'false' &&
                <div>
                  <Button className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>取消</Button>
                  <Button className="ok" type="primary" loading={addLoading} onClick={this.handleAdd}>确定</Button>
                </div>
            }
          </div>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, configCenter } = state
  const { data } = configCenter
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    data: data || [],
    clusterID,
  }
}

export default connect(mapStateToProps, {
  getService,
  getBranchList,
  getCenterEvn,
  addCenterConfig,
  putCenterConfig,
  getCenterConfig,
  releaseConfigService,
})(Form.create()(CreateConfig))
