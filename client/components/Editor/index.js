/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CodeMirror editor
 *
 * v0.1 - 2017-09-13
 * @author Zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import './style/index.less'

const defaultOpts = {
  lineNumbers: true,
  readOnly: false,
  styleActiveLine: true,
  lineWrapping: true,
  tabSize: 2,
}

export default class Editor extends React.Component {
  static propTypes = {
    title: PropTypes.string, // the title of editor
    autoSave: PropTypes.bool, // Automatically persist changes to underlying textarea (default false)
    value: PropTypes.string, // The editor value
    preserveScrollPosition: PropTypes.bool, // Preserve previous scroll position after updating value (default false)
    options: PropTypes.object, // options passed to the CodeMirror instance (https://codemirror.net/doc/manual.html#api)
    onChange: PropTypes.func, // Called when a change is made
    onFocusChange: PropTypes.func, // Called when the editor is focused or loses focus
  }

  state = {
    value: null,
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    if (value) {
      this.setState({
        value,
      })
    }
  }

  render() {
    let { title, options, ...otherProps } = this.props
    const { value } = this.state
    options = options || {}
    options.theme = 'monokai'
    options = Object.assign({}, defaultOpts, options)

    return (
      <div className="code-editor">
        {
          title && (
            <div className="code-editor-title">
              {title}
              <span>
                （{
                  options.readOnly
                    ? '只读'
                    : '读写'
                }）
              </span>
            </div>
          )
        }
        <CodeMirror
          ref="CodeMirror"
          options={options}
          {...otherProps}
          value={value}
          onBeforeChange={(editor, data, value) => {
            this.setState({ value })
          }}
        />
      </div>
    )
  }
}
