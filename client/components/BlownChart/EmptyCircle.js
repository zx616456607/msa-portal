/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Empty circle
 *
 * @author zhangxuan
 * @date 2018-08-22
 */
import React from 'react'
import NA_SVG from '../../assets/img/msa-manage/na.svg'
import './style/EmptyCircle.less'

export default ({ style }) => {
  return (
    <div className="empty-circle-box">
      <svg className="na-svg" style={style}>
        <use xlinkHref={`#${NA_SVG.id}`} />
      </svg>
      <div style={{ fontSize: 12 }}>暂无请求</div>
    </div>
  )
}
