import React from 'react'
import { Card, Form, Input, Select, Icon, Row, Col, Button, Radio, notification } from 'antd'
import { connect } from 'react-redux'
import './style/index.less'
import { MSA_DEVELOP_RULE_NAME_REG, MSA_DEVELOP_RULE_NAME_REG_NOTICE, API_CONFIG } from '../../../constants/index'
import { getLocalProjectDependency } from '../../../actions/msaDevelop'
import { getGlobalConfigByType } from '../../../actions/globalConfig'
import { toQuerystring } from '../../../common/utils';

const FormItem = Form.Item
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
const { MSA_DEVELOP_API } = API_CONFIG
const formItemLayout = {
  labelCol: {
    sm: { span: 8, pull: 5 },
  },
  wrapperCol: {
    sm: { span: 16, pull: 5 },
  },
}
const specialCharacterReg = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\u4e00-\u9fa5]/g
@connect(null, {
  getLocalProjectDependency,
  getGlobalConfigByType,
})
class LocalProject extends React.Component {
  state = {
    versionOfJavaArr: [
      {
        value: '1.8',
        text: '8',
      },
      {
        value: '1.11',
        text: '11',
      },
    ],
    developStyle: [
      {
        value: 'Spring-MVC',
        text: 'Spring-MVC',
      },
      {
        value: 'RPC',
        text: 'RPC',
      },
    ],
    bootVersion: [
      {
        value: '1.4.5.RELEASE',
        text: '1.4.5',
      },
      {
        value: '1.5.18.RELEASE',
        text: '1.5.18',
      },
      {
        value: '2.1.1.RELEASE',
        text: '2.1.1',
      },
    ],
    dependencies: [],
    expendAdvance: false,
    artifactoryUrl: '',
    artifactoryRepo: '',
  }
  componentDidMount() {
    const { getLocalProjectDependency, getGlobalConfigByType } = this.props
    getGlobalConfigByType(null, 'artifactory').then(res => {
      if (res.response && res.response.result.data !== '') {
        const { ConfigDetail } = res.response.result.data
        try {
          const config = JSON.parse(ConfigDetail)
          this.setState({
            artifactoryUrl: config.mavenRepositoryUrl,
          })
        } catch (e) {
          // do nothing
        }
      }
    })
    getLocalProjectDependency().then(res => {
      this.setState({
        dependencies: res.response.result,
      })
    })
  }
  dependencyKeys = key => {
    switch (key) {
      case 'microservice':
        return '微服务组件依赖'
      case 'basic':
        return '其他依赖'
      default:
        return ''
    }
  }
  showAdvance = () => this.setState({
    expendAdvance: !this.state.expendAdvance,
  })
  submit = () => {
    const { validateFields, resetFields } = this.props.form
    const { artifactoryUrl } = this.state
    if (artifactoryUrl === '') {
      notification.warn({
        message: '请联系管理员配置 Artifactory 地址',
      })
      return
    }
    validateFields(async (error, values) => {
      if (error) return
      const query = JSON.parse(JSON.stringify(values))
      query.mavenRepositoryUrl = artifactoryUrl
      window.open(`${MSA_DEVELOP_API}/starter.zip?${toQuerystring(query)}`)
      resetFields()
      this.setState({
        expendAdvance: false,
      })

    })
  }
  render() {
    const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form
    const { versionOfJavaArr, developStyle,
      dependencies, expendAdvance, bootVersion } = this.state
    const { name, developmentStyle } = getFieldsValue()
    return <div className="local-project">
      <div className="alert">
        直接创建微服务工程并下载，简化微服务工程的初始搭建，省去样板化配置步骤，直接快速进入业务代码开发阶段
      </div>
      <Card
        className="content"
        title="创建本地工程"
        hoverable
        actions={[ <Row>
          <Col span={8} pull={5}/>
          <Col span={8} pull={5}>
            <Button type="primary" onClick={this.submit}>创建并下载</Button>
          </Col>
        </Row> ]}
      >
        <Form className="local-project-form">
          <FormItem
            label="工程名称"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              onChange: e => {
                setFieldsValue({
                  artifactId: e.target.value,
                  packageName: `com.example.${e.target.value}`,
                })
              },
              rules: [{
                required: true,
                message: '请输入工程名称',
              }, {
                validator: (rule, val, cb) => {
                  if (val && (!MSA_DEVELOP_RULE_NAME_REG.test(val) ||
                    specialCharacterReg.test(val) ||
                    val.length === 0 || val.length > 24)
                  ) {
                    return cb(MSA_DEVELOP_RULE_NAME_REG_NOTICE)
                  }
                  return cb()
                },
              }],
            })(<Input placeholder="输入工程名称，例如：myproject"/>)}
          </FormItem>
          <FormItem
            label="Java 版本"
            {...formItemLayout}
          >
            {
              getFieldDecorator('javaVersion', {
                initialValue: [ versionOfJavaArr[0].value ],
                rules: [
                  {
                    required: true,
                    message: '请选择Java版本',
                  },
                ],
              })(<Select placeholder="请选择Java版本">
                {
                  versionOfJavaArr.map(v => (
                    <Option key={v.value}>
                      {v.text}
                    </Option>))
                }
              </Select>
              )
            }
          </FormItem>
          <FormItem
            label="开发风格"
            {...formItemLayout}
          >
            {
              getFieldDecorator('developmentStyle', {
                initialValue: developStyle[0].value,
                rules: [
                  {
                    required: true,
                    message: '请选择开发风格',
                  },
                ],
              })(<Select placeholder="请选择开发风格">
                {
                  developStyle.map(v => (
                    <Option key={v.value}>
                      {v.text}
                    </Option>))
                }
              </Select>
              )
            }
          </FormItem>
          {
            developmentStyle === 'RPC' &&
            <FormItem
              class="model"
              label="  "
              colon={false}
              {...formItemLayout}
            >
              {
                getFieldDecorator('model', {
                  initialValue: 'provider',
                })(
                  <RadioGroup>
                    <Radio value="provider">服务提供者</Radio>
                    <Radio value="consumer">服务消费者</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          }
          <FormItem
            label="bootVersion"
            {...formItemLayout}
          >
            {
              getFieldDecorator('bootVersion', {
                initialValue: bootVersion[0].value,
                rules: [
                  {
                    required: true,
                    message: '请选择bootVersion',
                  },
                ],
              })(<Select placeholder="请选择bootVersion">
                {
                  bootVersion.map(v => <Option key={v.value}>
                    {v.text}
                  </Option>)
                }
              </Select>
              )
            }
          </FormItem>
          <FormItem
            label="添加依赖"
            {...formItemLayout}
          >
            {
              getFieldDecorator('style')(<Select placeholder="选择工程中需添加的依赖组件" mode="multiple">
                {
                  Object.keys(dependencies).map(v => (
                    <OptGroup label={this.dependencyKeys(v)} key={v}>
                      {
                        dependencies[v].map(k => (
                          <Option key={k.id} style={developmentStyle === 'Spring-MVC' && k.id === 'my-cloud-dubbo' ?
                            { display: 'none' } : null }>
                            {k.name}
                          </Option>
                        ))
                      }
                    </OptGroup>))
                }
              </Select>
              )
            }
          </FormItem>
          <div className="advance-config">
            <Row>
              <Col span={8} pull={5} style={{ textAlign: 'right', marginLeft: -10, marginBottom: 24 }}>
                <span onClick={this.showAdvance}>
                  <Icon type={expendAdvance ? 'minus-square' : 'plus-square'}/> 高级设置
                </span>
              </Col>
            </Row>
            <div className={expendAdvance ? 'show' : 'hide' }>
              <FormItem
                label="Group ID"
                {...formItemLayout}
              >
                {getFieldDecorator('groupId', {
                  initialValue: 'com.example',
                  rules: [{
                    required: true,
                    message: '请输入Group ID',
                  }, {
                    validator: (rule, val, cb) => {
                      const str = val.replace(/\./g, '')
                      if (specialCharacterReg.test(str)) {
                        cb('不能包含特殊字符或中文')
                      }
                      cb()
                    },
                  }],
                })(<Input placeholder="请输入Group ID"/>)}
              </FormItem>
              <FormItem
                label="Version"
                {...formItemLayout}
              >
                {getFieldDecorator('version', {
                  initialValue: '0.0.1-SNAPSHOT',
                  rules: [{
                    required: true,
                    message: '请输入Version',
                  }],
                })(<Input placeholder="请输入Version"/>)}
              </FormItem>
              <FormItem
                label="Artifact ID"
                {...formItemLayout}
              >
                {getFieldDecorator('artifactId', {
                  initialValue: name,
                  rules: [{
                    required: true,
                    message: '请输入Artifact ID',
                  }],
                })(<Input placeholder="请输入Artifact ID"/>)}
              </FormItem>
              <FormItem
                label="PackageName"
                {...formItemLayout}
              >
                {getFieldDecorator('packageName', {
                  initialValue: name ? `com.example.${name}` : 'com.example',
                  rules: [{
                    required: true,
                    message: '请输入PackageName',
                  }],
                })(<Input placeholder="请输入PackageName"/>)}
              </FormItem>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  }
}

export default Form.create()(LocalProject)
