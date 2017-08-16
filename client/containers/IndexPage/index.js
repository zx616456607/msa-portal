/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * IndexPage container
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'

export default class IndexPage extends React.Component {
  test = a => <h2>{a}</h2>

  render() {
    return (
      <div>
        <h1>IndexPage</h1>
        {this.test('arrow function')}
      </div>
    )
  }
}
