import React from 'react'

export default class TransactionInspector extends React.Component {
  render() {
    return (
      <div>
        <h1 onClick={() => this.setState({ isVisible: false })}>
          哈哈哈，我是 inspector
        </h1>
        <pre>
          {
            JSON.stringify(this.props.callStack, null, 2)
          }
        </pre>
      </div>
    )
  }
}
