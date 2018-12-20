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
import filter from 'lodash/filter'
import { withNamespaces } from 'react-i18next'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input

@withNamespaces('ConfigCenter')
class CreateConfig extends React.Component {
  state = {
    yaml: '',
    branchName: '',
    inputValue: '',
    textAreaValue: '',
    btnVasible: true,
    detail: 'false',
    releaseVasible: false,
    branchData: [],
    configGitUrl: '',
    currentYaml: '',
    editLoading: false,
    addLoading: false,
    releaseLoading: false,
  }
  componentDidMount() {
    const { location } = this.props
    const { detail } = parse(location.search)
    this.setState({
      detail,
    })
    this.version()
  }

  version = () => {
    const { getService, getBranchList, clusterID, location, getCenterEvn } = this.props
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
        } else if (detail === 'false') {
          const path = parse(location.search).path
          // const envData = this.props.envData[branch + '/' + (path || '')]
          const evnQuery = {
            project_url: url,
            branch_name: branch,
            path,
          }
          getCenterEvn(clusterID, evnQuery)
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
    const path = parse(location.search).path
    const query = {
      file_path: (path ? path + '/' : '') + location.pathname.split('/')[3],
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
    const { t, putCenterConfig, clusterID, location } = this.props
    const path = parse(location.search).path
    const query = {
      branch_name: encodeURIComponent(branchName),
      file_path: (path ? path + '/' : '') + encodeURIComponent(inputValue === '' ? this.props.location.pathname.split('/')[3] : inputValue),
      commit_message: encodeURIComponent(textAreaValue === '' ? t('createConfig.addAConfig') : textAreaValue),
      project_url: encodeURIComponent(configGitUrl),
    }
    if (!currentYaml) {
      notification.warn({
        message: t('createConfig.yamlMsg'),
      })
      return
    }
    const yamls = currentYaml === '' ? yaml : currentYaml
    if (yaml === '' && currentYaml === '') {
      notification.warn({
        message: t('createConfig.noConfigContent'),
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
            message: t('createConfig.putFailed'),
          })
          return
        }
        if (res.response.result.code === 200) {
          notification.success({
            message: t('createConfig.putSucc'),
          })
          this.setState({
            btnVasible: false,
            releaseVasible: true,
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
    const { t, releaseConfigService, clusterID, history } = this.props
    this.setState({
      releaseLoading: true,
    })
    releaseConfigService(clusterID).then(res => {
      if (res.error) {
        notification.error({
          message: t('createConfig.releaseFailed'),
        })
        this.setState({
          releaseLoading: false,
        })
        return
      }
      if (res.type === 'CENTER_RELEASE_SUCCESS') {
        notification.success({
          message: t('createConfig.releaseSucc'),
        })
        history.push('/msa-manage/config-center')
      }
    })
  }

  handleAdd = () => {
    const { currentYaml, branchName, inputValue, textAreaValue, configGitUrl } = this.state
    const { t, addCenterConfig, clusterID, history } = this.props
    if (this.onCheckName(inputValue)) {
      this.props.form.validateFields(err => {
        if (err) return
        if (currentYaml === '') {
          notification.warn({
            message: t('createConfig.submitFailed'),
            description: t('createConfig.noConfigContent'),
          })
          return
        }
        this.setState({
          addLoading: true,
        })
        const path = parse(this.props.location.search).path
        const query = {
          branch_name: encodeURIComponent(branchName),
          file_path: (path ? path + '/' : '') + inputValue,
          commit_message: encodeURIComponent(textAreaValue),
          project_url: configGitUrl,
        }
        addCenterConfig(clusterID, currentYaml, query).then(res => {
          if (res.error) {
            this.setState({
              addLoading: false,
            })
            notification.error({
              message: t('createConfig.addFailed'),
            })
            return
          }
          if (res.response.result.code === 200) {
            notification.success({
              message: t('createConfig.addSucc'),
            })
            history.push('/msa-manage/config-center?from_add=true' + (path ? '&path=' + path : ''))
          }
        })
      })
    }
  }
  onCheckName = value => {
    const { t } = this.props
    notification.destroy()
    if (!value) {
      notification.warn({
        message: t('createConfig.checkNameErr1'),
      })
      return false
    }
    if (value.startsWith('/') || value.endsWith('/')) {
      notification.warn({
        message: t('createConfig.checkNameErr2'),
      })
      return false
    }
    const arr = value.split('/')
    if (arr.length > 2) {
      notification.warn({
        message: t('createConfig.checkNameErr3'),
      })
      return false
    }
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        const { envData, location } = this.props
        const { branch, path } = parse(location.search)
        const data = envData[branch + '/' + (path || '')]
        const temp = filter(data, { name: arr[i] })[0]
        if (temp) {
          notification.warn({
            message: (arr.length > 1 ? t('createConfig.checkNameErr4') : t('createConfig.checkNameErr5')) + t('createConfig.checkNameErr6'),
          })
          return false
        }
      }
      if (!REPOSITORY_REGEXP.test(arr[i])) {
        notification.warn({
          message: t('createConfig.checkNameErr7'),
        })
        return false
      }
    }
    return true
  }
  // onCheckName = (rule, value, callback) => {
  //   if (!value) {
  //     notification.warn({
  //       message: '请输入文件名称',
  //     })
  //     return callback(new Error(''))
  //   }
  //   if (value.startsWith('/') || value.endsWith('/')) {
  //     notification.warn({
  //       message: '不能以 \'/\' 开头 和 结尾',
  //     })
  //     return callback(new Error(''))
  //   }
  //   const arr = value.split('/')
  //   for (let i = 0; i < arr.length; i++) {
  //     if (i === 0 && !arr[i]) {
  //       const { envData, location } = this.props
  //       const { branch, path } = parse(location.search)
  //       const data = envData[branch + '/' + (path || '')]
  //       const temp = filter(data, { name: arr[i] })[0]
  //       if (temp) {
  //         notification.warn({
  //           message: (arr.length > 1 ? '文件夹' : '文件') + '名称已存在',
  //         })
  //         return callback(new Error(''))
  //       }
  //     }
  //     if (!REPOSITORY_REGEXP.test(arr[i])) {
  //       notification.warn({
  //         message: '名称可由 2~50 位字母、数字、中划线下划线和点组成，以字母开头',
  //       })
  //       return callback(new Error(''))
  //     }
  //   }
  //   callback()
  // }
  render() {
    const { detail, yaml, branchData, btnVasible, currentYaml,
      branchName, addLoading, editLoading, releaseLoading } = this.state
    // const defaultValue = branchData[0] !== undefined ? branchData[0].name : ''
    const { t, location, form } = this.props
    const projectName = location.pathname.split('/')[3]
    const { getFieldDecorator } = form
    const path = parse(location.search).path
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
            <FormItem className="config-name" {...fromLayout} label={t('createConfig.name')}>
              {getFieldDecorator('configName', {
                initialValue: detail !== 'false' ? projectName : undefined,
                rules: [
                  // { required: true, whitespace: true, message: '请输入文件名称' },
                  // { validator: this.onCheckName },
                ],
                validateTrigger: 'onSubmit',
              })(
                <Input addonBefore={'.../' + (path || '')} disabled={detail === 'update' || detail === 'true'} placeholder={t('createConfig.namePlaceholder')} onChange={this.handleInput} />
              )}
            </FormItem>
          </Row>
          <Row className="connent">
            <FormItem {...fromLayout} label={t('createConfig.configVersion')}>
              {getFieldDecorator('edition', {
                initialValue: branchName || undefined,
                rules: [{ required: true, whitespace: true, message: t('createConfig.pleaseEnterVersion') }],
              })(
                <Select className="selects" placeholder={t('createConfig.pleaseEnterVersion')} disabled={detail === 'update' || detail === 'true'} onChange={this.handlechage}>
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
          <Row className="connent yaml-box">
            <FormItem {...fromLayout} label={t('createConfig.configContent')}>
              {getFieldDecorator('info', {
                initialValue: currentYaml === '' ? yaml : currentYaml,
                rules: [{ required: true, whitespace: true, message: t('createConfig.pleaseEnterContent') }],
              })(
                <YamlEditor options={readOnly} style={{ width: '60%' }} onChange={this.handleYamlEditor} />
              )}
            </FormItem>
          </Row>
          {
            detail !== 'true' ?
              <Row className="connents connent">
                <FormItem {...fromLayout} label="Commit">
                  {getFieldDecorator('configArea', {
                    rules: [{ required: true, whitespace: true, message: t('createConfig.pleaseEnterCommit') }],
                  })(
                    <TextArea className="textArea" placeholder={t('createConfig.pleaseEnterCommit1')} autosize={{ minRows: 1.5, maxRows: 6 }} onChange={this.handleTextArea} />
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
                    [ <Button key="close" className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>{t('createConfig.cancelText')}</Button>,
                      <Button key="confirm" className="close" type="primary" loading={editLoading} onClick={this.handleSaveUpdate}>{t('createConfig.saveText')}</Button> ]
                    :
                    [
                      <Button key="ok" className="ok" type="primary" loading={releaseLoading} onClick={this.handleRelease}>{t('createConfig.release')}</Button>,
                      <Button key="confirm" className="close" type="primary" loading={editLoading} onClick={this.handleSaveUpdate}>{t('createConfig.saveText')}</Button> ]
                }
              </div>
            }
            {
              detail === 'true' &&
              <div>
                <Button type="primary" className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>{t('createConfig.okText')}</Button>
              </div>
            }
            {
              detail === 'false' &&
              <div>
                <Button className="close" onClick={() => this.props.history.push('/msa-manage/config-center')}>{t('createConfig.cancelText')}</Button>
                <Button className="ok" type="primary" loading={addLoading} onClick={this.handleAdd}>{t('createConfig.okText')}</Button>
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
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
    envData: configCenter,
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
