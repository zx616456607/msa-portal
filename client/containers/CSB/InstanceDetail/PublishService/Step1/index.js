/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: step 1
 *
 * 2018-01-09
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import { connect } from 'react-redux'
import AccessAgreement from './AccessAgreement/'
import OpenAgreement from './OpenAgreement'
import CascadingLinkRules from './CascadingLinkRules'
import {
  getCascadedServicesPrerequisite,
} from '../../../../../actions/CSB/instanceService'
import {
  cascadingLinkRuleSlt,
} from '../../../../../selectors/CSB/cascadingLinkRules'

class Step1 extends React.Component {

  render() {
    const {
      servicesInbounds, serviceGroups,
      currentInstance, data, isEdit, ...otherProps
    } = this.props
    const classNames = ClassNames({
      fields: true,
    })

    return [
      <div className={classNames} key="fields">
        <AccessAgreement
          isEdit={isEdit}
          dataList={data}
          currentInstance={currentInstance}
          servicesInbounds={servicesInbounds}
          {...otherProps}
        />
        <OpenAgreement
          isEdit={isEdit}
          dataList={data}
          serviceGroups={serviceGroups}
          {...otherProps}
        />
        <CascadingLinkRules
          {...otherProps}
          data={data}
          isEdit={isEdit}
        />
      </div>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  const { csbInstanceServiceGroups } = state.entities
  return {
    csbInstanceServiceGroups,
    cascadingLinkRules: cascadingLinkRuleSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getCascadedServicesPrerequisite,
})(Step1)
