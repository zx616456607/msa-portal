/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * NewRoute container
 *
 * 2018-10-10
 * @author zhouhaitao
 */

import React from 'react'
import ReturnButton from '@tenx-ui/return-button'
import { Card, Form, Input, Select, Radio, Button, Tag, Icon, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { getMeshGateway } from '../../../actions/meshGateway'
import './style/NewRoute.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10, push: 1 },
  },
}
const dynamicFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10, push: 1 },
  },
};
let hostUuid = 1;
let routeUuid = 10000;
let routeConditionUuid = 30000
const mapStateToProps = state => {
  return {
    meshGatewayList: state.meshGateway.meshGatewayList,
    clusterID: state.current && state.current.config.cluster.id,
  }
}
@connect(mapStateToProps, {
  getMeshGateway,
})
class NewRouteComponent extends React.Component {
  state = {
    ruleName: '',
    visitType: 'pub',
    routeType: 'content',
    gateways: [],
    hosts: [
      {},
    ],
  }
  componentDidMount() {
    const { clusterID, getMeshGateway } = this.props
    getMeshGateway(clusterID)
  }
  nameProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('ruleName', {
      onChange: e => this.setState({ ruleName: e.target.value }),
      rules: [
        { required: true, message: '请输入规则名称' },
      ],
      trigger: 'onChange',
    })
  }
  domainProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('serviceDomain', {
      rules: [
        { required: true, message: '请输入服务域名' },
      ],
      trigger: 'onChange',
    })
  }
  addItem = key => {
    const { form } = this.props;
    const keys = form.getFieldValue(key);
    let uid
    switch (key) {
      case 'hostKeys':
        hostUuid++;
        uid = hostUuid
        break
      case 'routeKeys':
        routeUuid++;
        uid = routeUuid
        break
      case 'routeConditionkeys':
        routeConditionUuid++
        uid = routeConditionUuid
        break
      default:
        break
    }
    const nextKeys = keys.concat(uid);
    form.setFieldsValue({
      [key]: nextKeys,
    });
  }
  removeItem = (k, key) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(key);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      [key]: keys.filter(keyItem => keyItem !== k),
    });

  }
  visitTypeProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('visitType', {
      initialValue: this.state.visitType,
      onChange: e => this.setState({ visitType: e.target.value }),
    })
  }
  renderHosts = () => {
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 3 },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('hostKeys', { initialValue: [ 0 ] });
    const hostList = getFieldValue('hostKeys');
    const hostItems = hostList.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? dynamicFormItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? <span>服务域名
            <Tooltip title= "服务对外访问地址，用户需自行申请，并确保所填域名能解析到所选网关的服务地址（在选择的网关中添加该域名）">
              <Icon style={{ marginLeft: 8 }} type="question-circle" theme="outlined" />
            </Tooltip>
          </span> : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`host[${k}]`, {
            validateTrigger: [ 'onChange', 'onBlur' ],
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入服务域名',
            }],
          })(
            <Input
              addonAfter={<Icon type="plus" onClick={() => this.addItem('hostKeys')}/>}
              placeholder="passenger name"
              style={{ width: '200px', marginRight: 8 }} />
          )}
          {hostList.length > 1 ? (
            <Button
              icon="minus"
              style={{ marginLeft: 16 }}
              disabled={hostList.length === 1}
              onClick={() => this.removeItem(k, 'hostKeys')}
            />
          ) : null}
        </FormItem>
      );
    });
    return hostItems
  }
  renderRouteItem = () => {
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 3 },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('routeKeys', { initialValue: [ 9999 ] });
    const routeList = getFieldValue('routeKeys');
    const routeConditionsItem = () => {
      getFieldDecorator('routeConditionkeys', { initialValue: [ 29999 ] });
      const routeConditionList = getFieldValue('routeConditionkeys');
      const rules = [ '=', '!=', '<', '<=', '>=', '>', '包含', '不包含' ]
      const routeConditionsDomList = routeConditionList.map((k, index) => {
        return (
          <FormItem
            label={index === 0 ? '路由条件' : ''}
            key={k}
          >
            <div className="condition-item">
              <FormItem>
                {getFieldDecorator(`condition[${k}]`, {
                  initialValue: 'Header',
                })(
                  <Select
                    style={{ width: 100 }}
                  >
                    <Option value="Header">Header</Option>
                    <Option value="Url">Url</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator(`paramName[${k}]`, {
                  initialValue: '',
                })(
                  <Input style={{ width: 100 }} placeholder="请输入参数名"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator(`rule[${k}]`, {
                  initialValue: '=',
                })(
                  <Select style={{ width: 100 }}>
                    {
                      rules.map(v => <Option value={v} key={v}>{v}</Option>)
                    }
                  </Select>
                )}
              </FormItem>
            </div>

          </FormItem>
        )
      })
      return routeConditionsDomList

    }
    const routesBasedReqContent = routeList.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? dynamicFormItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '路由类型' : ''}
          required={false}
          key={k}
        >
          {
            index === 0 && <div className="route-type-wrapper">
              <RadioGroup
                value={this.state.routeType}
                onChange={e => this.setState({ routeType: e.target.value })}>
                <Radio value="content">基于请求内容</Radio>
                <Radio value="traffic" disabled>基于流量比例</Radio>
              </RadioGroup>
              <div className="route-type-tip">
                <span>
                  <Icon type="question"/>
                  选择“基于请求内容类型”，您以前配置的【基于流量比例规则】将全部删除
                </span>
                <Icon type="close"/>
              </div>
              添加路由项
            </div>
          }
          <div className="route-type-item">
            <div className="remove-route-item" onClick={() => this.removeItem(k, 'routeKeys')}>
              <Icon type="delete" theme="outlined" />
            </div>
            <div>{routeConditionsItem()}</div>
          </div>
          {
            index === routeList.length - 1 && <div className="add-new-route" onClick={() => this.addItem('routeKeys')}><Icon type="plus"/>添加一个路由项</div>
          }
          {/*          {getFieldDecorator(`routeRuleItem[${k}]`, {
            validateTrigger: [ 'onChange', 'onBlur' ],
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入服务域名',
            }],
          })(
            <Input
              addonAfter={<Icon type="plus" onClick={() => add()}/>}
              placeholder="passenger name"
              style={{ width: '200px', marginRight: 8 }} />
          )}
          {keys.length > 1 ? (
            <Button
              icon="minus"
              style={{ marginLeft: 16 }}
              disabled={keys.length === 1}
              onClick={() => remove(k)}
            />
          ) : null}*/}
        </FormItem>
      );
    });
    return <div className="route-rules-wrapper">
      {this.state.routeType === 'content' ? routesBasedReqContent : ''}
    </div>
  }

  render() {
    const { meshGatewayList } = this.props
    const { nameProps, visitTypeProps } = this
    const { gateways } = this.state
    const { visitType } = this.state
    return <div id="new-route">
      <div className="top">
        <ReturnButton onClick={() => this.props.history.push('/service-mesh/routes-management')}>返回路由管理列表</ReturnButton>
        <span>
          {
            this.props.match.params.id ? '创建路由规则' : '编辑路由规则'
          }
        </span>
      </div>
      <Card>
        <Form>
          <FormItem
            label="规则名称"
            {...formItemLayout}
          >
            {nameProps()(<Input placeholder="请输入规则名称"/>)}
          </FormItem>
          <FormItem
            label="选择组件"
            {...formItemLayout}
          >
            <Select
              placeholder="请选择组件"
              style={{ width: 200 }}
            >
              <Option value="1"> 组件1</Option>
              <Option value="2"> 组件2</Option>
            </Select>
          </FormItem>
          <FormItem
            label="访问方式"
            {...formItemLayout}
          >
            {
              visitTypeProps()(
                <RadioGroup>
                  <Radio value="pub">公网访问</Radio>
                  <Radio value="inner">仅在集群内访问</Radio>
                </RadioGroup>
              )
            }
            <div className="visit-type-inner">
              {
                visitType === 'pub' ?
                  <div className="pub-content">
                    <div className="tip">该规则中的服务可通过网关访问，请选择网络出口</div>
                    <div className="selection">
                      <Select
                        mode="multiple"
                        placeholder="选择网关（gateway）"
                        style={{ width: 200 }}
                      >
                        {
                          (meshGatewayList.data && meshGatewayList.data.length !== 0) &&
                            meshGatewayList.data.map(v => <Option value={v} key={v}>{v}</Option>)
                        }
                      </Select>
                      <Button icon="sync"/>
                      <a href="/service-mesh/mesh-gateway" target="_blank">去创建网关 >></a>
                      <div>
                        {
                          gateways && gateways.map(v => <Tag closable key={ v.id }>{v.text}</Tag>)
                        }
                      </div>
                    </div>
                  </div>
                  :
                  <div className="inner-content">
                    该规则中的服务仅提供给集群内其他服务访问
                  </div>
              }
            </div>
          </FormItem>
          {this.renderHosts()}
          {this.renderRouteItem()}
        </Form>
      </Card>
    </div>
  }
}

const NewRoute = Form.create()(NewRouteComponent)
export default NewRoute
