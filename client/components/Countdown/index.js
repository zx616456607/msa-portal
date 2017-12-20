/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Countdown component
 *
 * 2017-12-19
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

export default class Countdown extends React.Component {
  static propTypes = {
    seconds: PropTypes.number.isRequired,
    onComplete: PropTypes.func,
  }

  state = {
    seconds: parseInt(this.props.seconds),
  }

  componentDidMount() {
    let { seconds } = this.state
    this.countInterval = setInterval(() => {
      seconds--
      this.setState({
        seconds,
      }, () => {
        if (this.state.seconds === 0) {
          const { onComplete } = this.props
          onComplete && onComplete(true)
          clearInterval(this.countInterval)
        }
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.countInterval)
  }

  render() {
    const { seconds } = this.state
    return (
      <span>{moment(+new Date() - seconds * 1000).toNow()}</span>
    )
  }
}
