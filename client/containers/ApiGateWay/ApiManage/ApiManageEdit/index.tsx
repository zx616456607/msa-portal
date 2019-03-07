import * as React from 'react'
import { Card, Input, Form, Select, Icon, Button, Radio, Checkbox, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import ReturnButton from '@tenx-ui/return-button'
import './style/ApiManageEdit.less'

const { TextArea } = Input
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const formItemLayout = {
  labelCol: {
    sm: { span: 8, pull: 4 },
  },
  wrapperCol: {
    sm: { span: 16, pull: 4 },
  },
};
interface ApiDetailProps {

}

class ApiManageEdit extends React.Component<ApiDetailProps> {
  onApiGroupChange = () => {

  }
  onApiGroupFocus = () => {

  }
  onApiGroupBlur = () => {

  }
  onFilterApiGroup = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  onReturn = () => this.props.history.push('/api-gateway')
  onSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const nameValidator = getFieldDecorator('apiName', {
      rules: [{
        required: true,
        validator: (rule, val, cb) => {
          if (!val) {
            return cb('请填写API 组名称')
          }
          cb()
        },
      }],
    })
    const desValidator = getFieldDecorator('description', {
      rules: [{
        validator: (rule, val, cb) => {
          if (!val) { return cb() }
          if (val.length > 128) {
            return cb('支持128个汉字或字符')
          }
          cb()
        },
      }],
    })
    const apiGroupValidator = getFieldDecorator('apiGroup', {
      onChange: this.onApiGroupChange,
      rules: [{
          required: true,
          message: '请选择 API 组',
        }],
    })
    const visitValidator = getFieldDecorator('visitControl', {
      initialValue: 'Basic-Auth',
      rules: [{
        required: true,
        message: '请选择访问控制方式',
      }],
    })
    const protocalValidator = getFieldDecorator('protocal', {
      initialValue: ['HTTP'],
      rules: [{
        required: true,
        message: '请选择协议',
      }],
    })
    const methodsValidator = getFieldDecorator('methods', {
      initialValue: [],
      rules: [{
        required: true,
        message: '请选择请求方法',
      }],
    })
    const pathValidator = getFieldDecorator('apiPath', {
      rules: [{
        required: true,
        validator: (rule, val, cb) => {
          if (!val) {
            return cb('请填写访问路径')
          }
          if (!/^\//.test(val)) { return cb('以 / 开头') }
          cb()
        },
      }],
    })

    return <div className="api-manage-detail">
      <div className="top">
        <ReturnButton onClick={this.onReturn}>返回</ReturnButton>
        <span>创建 API</span>
      </div>
      <Form>
        <Card
          hoverable
          actions={[
            <Row className="btn-group" key="btn-group">
              <Col span={8} pull={4}/>
              <Col span={16} pull={4}>
                <Button key="cancel" onClick={this.onReturn}>取消</Button>,
                <Button key="ok" type="primary" onClick={this.onSubmit}>确定</Button>,
              </Col>
            </Row>,
          ]}
        >
          <div className="form-content">
            <Form.Item
              label="API 组名称"
              {...formItemLayout}
            >
              {
                nameValidator(<Input placeholder="可由1-63个中文字符、英文字母、数字或中华先 ”-“ 组成"/>)
              }
            </Form.Item>
            <Form.Item
              label="描述"
              {...formItemLayout}
            >
              {
                desValidator(<TextArea placeholder="请输人描述，支持1-128个汉字或字符"/>)
              }
            </Form.Item>
            <Form.Item
              label="所属API组"
              {...formItemLayout}
            >
              <div className="api-group-box">
                {
                  apiGroupValidator(
                    <Select
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      onFocus={this.onApiGroupFocus}
                      onBlur={this.onApiGroupBlur}
                      filterOption={this.onFilterApiGroup}
                    >
                      <Option key="jack" value="jack">Jack</Option>
                      <Option key="lucy" value="lucy">Lucy</Option>
                      <Option key="tom" value="tom">Tom</Option>
                    </Select>,
                  )
                }
                <div className="api-group-operation">
                  <Button icon="sync"/>
                  <Link to="/">新建 API 组 >></Link>
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label="访问控制"
              {...formItemLayout}
            >
              {
                visitValidator(
                  <RadioGroup>
                    <Radio key="Basic-Auth" value={'Basic-Auth'}>Basic Auth</Radio>
                    <Radio key="JWT" value={'JWT'}>JWT</Radio>
                    <Radio key="OAuth2" value={'OAuth2'}>OAuth2</Radio>
                    <Radio key="0" value={'0'}>无认证</Radio>
                  </RadioGroup>,
                )
              }
            </Form.Item>
            <Form.Item
              label="协议"
              {...formItemLayout}
            >
              {
                protocalValidator(
                  <CheckboxGroup
                    options={[
                      { label: 'HTTP', value: 'HTTP' },
                      { label: 'HTTPS', value: 'HTTPS' },
                    ]}
                  />,
                )
              }
            </Form.Item>
            <Form.Item
              label="请求方法"
              {...formItemLayout}
            >
              {
                methodsValidator(
                  <Select mode="multiple">
                    <Option key="GET" value="GET">GET</Option>
                    <Option key="POST" value="POST">POST</Option>
                    <Option key="PUT" value="PUT">PUT</Option>
                    <Option key="DELETE" value="DELETE">DELETE</Option>
                  </Select>,
                )
              }
            </Form.Item>
            <Form.Item
              label="访问路径"
              {...formItemLayout}
            >
              <>
                {
                  pathValidator(<Input placeholder="请自定义url地址，以／开头"/>)
                }
                <span className="tip">
                  <Icon type="info-circle" /> 网关对外暴露的API路径
                </span>
              </>
            </Form.Item>
          </div>
        </Card>
      </Form>
    </div>
  }
}

export default Form.create()(ApiManageEdit)
