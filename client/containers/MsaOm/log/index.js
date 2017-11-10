import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import { Icon } from 'antd'

class LogComponent extends React.Component {
  state = {
    bigLog: false,
  }

  componentWillMount() {}

  handleDown = () => {}

  onChangeBigLog = () => {
    this.setState({
      bigLog: !this.state.bigLog,
    })
  }

  render() {
    return (
      <div className="body">
        <div className="title">
          <span className="desc">结果查询页</span>
          <Icon type="download" className="down" />
          <span className="download" onClick={this.handleDown}>下载</span>
          <i className={this.state.bigLog ? 'fa-right fa fa-compress' : 'fa-right fa fa-expand'} onClick={this.onChangeBigLog} />
        </div>
        <div className="connent">
          <div className="info">
            <span>暂无日志记录</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
})(LogComponent)

