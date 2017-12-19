import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import { Icon, Card } from 'antd'

class LogComponent extends React.Component {
  state = {
    bigLog: false,
  }

  componentWillMount() { }

  handleDown = () => { }

  onChangeBigLog = () => {
    this.setState({
      bigLog: !this.state.bigLog,
    })
  }

  render() {
    return (
      <Card className="info bigLogBox">
        <div className="logs-detail" style={{ padding: 0 }}>
          <div className="title">
            <span className="desc">结果查询页</span>
            <div>
              <Icon type="download" className="down" />
              <span className="download" onClick={this.handleDown}>下载</span>
            </div>
            <Icon type="arrows-alt" className="enlarge"/>
          </div>
          <div className="connent">
            <div className="infos">
              <span>暂无日志记录</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
})(LogComponent)

