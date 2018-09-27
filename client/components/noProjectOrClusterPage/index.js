/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * index.js page
 *
 * @author zhangtao
 * @date Thursday September 27th 2018
 */
import React from 'react'
import noProjectsImage from '../../assets/img/no-projects.png'
import noClustersImage from '../../assets/img/no-clusters.png'
import './styles/index.less'

export const NoClusterPage = () => {
  return (
    <div className="noclustersOrPrjects">
      <div className="noclustersOrPrjectsinfoWrap">
        <img src={noProjectsImage} alt="no-projects" />
        <br />
        <span>
    帐号还未加入任何项目，请先『创建项目』或『联系管理员加入项目』
        </span>
      </div>
    </div>
  )
}

export const NoProjectPage = () => {
  return (
    <div className="noclustersOrPrjects">
      <div className="noclustersOrPrjectsinfoWrap">
        <img src={noClustersImage} alt="no-clusters" />
        <br />
        <span>
      项目暂无授权的集群，请先申请『授权集群』或选择其他项目
        </span>
      </div>
    </div>
  )
}
