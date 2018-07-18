/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Yaml editor
 *
 * v0.1 - 2017-09-13
 * @author Zhangpc
 */

import React from 'react'
import Editor from './'

export default class YamlEditor extends React.Component {
  render() {
    const defaultOptions = {
      mode: 'yaml',
      readOnly: false,
    }
    const options = Object.assign({}, defaultOptions, this.props.options)
    const { title, ...otherProps } = this.props
    return <Editor title={ title || 'Yaml' } {...otherProps} options={options} />
  }
}
