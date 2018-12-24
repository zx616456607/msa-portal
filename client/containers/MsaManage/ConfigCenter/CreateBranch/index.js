
import React from 'react'
import { connect } from 'react-redux'
import { createBranch } from '../../../../actions/configCenter'
import { Modal, Form, Input, Select } from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import { withNamespaces } from 'react-i18next'

const fromLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

@withNamespaces('ConfigCenter')
class CreateBranch extends React.Component {
  state = {
    btnLoading: false,
  }
  onOk = () => {
    const { onOk, form: { validateFields }, createBranch, project_url, clusterID } = this.props
    validateFields((errors, values) => {
      if (errors) return
      const query = cloneDeep(values)
      query.project_url = project_url
      this.setState({
        btnLoading: true,
      }, () => {
        createBranch(clusterID, query).then(res => {
          this.setState({
            btnLoading: false,
          })
          if (res.response && res.response.result && res.response.result.code === 200) {
            onOk && onOk(query.branch_name)
          }
        })
      })
    })
  }
  render() {
    const { t, visible, form, branchs, onCancel, current } = this.props
    const { btnLoading } = this.state
    const { getFieldDecorator } = form
    const options = branchs.map(item =>
      <Select.Option key={item.name}>{item.name}</Select.Option>)
    return (
      <Modal
        visible={visible}
        title={t('createBranch.title')}
        onOk={this.onOk}
        onCancel={onCancel}
        confirmLoading={btnLoading}
      >
        <Form>
          <Form.Item
            label={t('createBranch.branchName')}
            {...fromLayout}
          >
            {
              getFieldDecorator('branch_name', {
                initialValue: undefined,
                rules: [{ required: true, message: t('createBranch.branchNamePlaceholder') }],
              })(
                <Input placeholder={t('createBranch.branchNamePlaceholder')} />
              )}
          </Form.Item>
          <Form.Item
            label={t('createBranch.sourceBranch')}
            {...fromLayout}
          >
            {
              getFieldDecorator('ref_branch', {
                initialValue: current,
                rules: [{ required: true, message: t('createBranch.sourceBranchPlaceholder') }],
              })(
                <Select placeholder={t('createBranch.sourceBranchPlaceholder')}>
                  {options}
                </Select>
              )}
          </Form.Item>
        </Form>
      </Modal>
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
  createBranch,
})(Form.create()(CreateBranch))

