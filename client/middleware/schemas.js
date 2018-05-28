/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Schemas
 *
 * 2017-08-16
 * @author zhangpc
 */

import { schema } from 'normalizr'
import { JWT } from '../constants'

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr

const apmSchema = new schema.Entity('apms', {}, {
  idAttribute: 'id',
})

const springcloudSchema = new schema.Entity('springcloud', {}, {
  idAttribute: 'id',
})

const authSchema = new schema.Entity('auth', {}, {
  idAttribute: () => JWT,
})

const projectSchema = new schema.Entity('projects', {}, {
  idAttribute: 'namespace',
})

const clusterSchema = new schema.Entity('clusters', {}, {
  idAttribute: 'clusterID',
})

// PinPoint
const ppAppsSchema = new schema.Entity('ppApps', {}, {
  idAttribute: 'applicationName',
})

// MsaList
const MsaList = new schema.Entity('msaList', {}, {
  idAttribute: 'appName',
})

// GatewayPolicies
const gatewayPolicies = new schema.Entity('gatewayPolicies', {}, {
  idAttribute: 'id',
})

// GatewayRoutes
const gatewayRoutesSchema = new schema.Entity('gatewayRoutes', {}, {
  idAttribute: 'id',
})

// CSB instances
const csbPubInstancesSchema = new schema.Entity('csbPubInstances', {}, {
  idAttribute: 'id',
})
const csbAvaInstancesSchema = new schema.Entity('csbAvaInstances', {}, {
  idAttribute: 'instanceId',
})
const csbOmInstancesSchema = new schema.Entity('csbOmInstances', {}, {
  idAttribute: 'id',
})

// CSB myApplication
const csbApplySchema = new schema.Entity('csbApply', {}, {
  idAttribute: 'id',
})

// CSB InstanceService
const csbPublishedSchema = new schema.Entity('cbsPublished', {}, {
  idAttribute: 'id',
})
const csbSubscribeSchema = new schema.Entity('csbSubscribe', {}, {
  idAttribute: 'id',
})
const csbInstanceServiceGroupsSchema = new schema.Entity('csbInstanceServiceGroups', {}, {
  idAttribute: 'id',
})
const csbInstanceConsumerVouchersSchema = new schema.Entity('csbInstanceConsumerVouchers', {}, {
  idAttribute: 'id',
})
const csbInstanceMySubscribedServicesSchema = new schema.Entity('csbInstanceMySubscribedServices', {}, {
  idAttribute: 'id',
})

const csbInstanceServiceSubscribeApproveSchema = new schema.Entity('csbInstanceServiceSubscribeApprove', {}, {
  idAttribute: 'id',
})

// CSB InstanceService ACL
const csbInstanceServiceACLSchema = new schema.Entity('csbInstanceServiceACL', {}, {
  idAttribute: 'id',
})

// CSB InstanceService Detail
const csbInstanceServiceDetailSchema = new schema.Entity('csbInstanceServiceDetail', {}, {
  idAttribute: 'id',
})

const csbCascadingLinkRuleSchema = new schema.Entity('csbCascadingLinkRule', {}, {
  idAttribute: 'id',
})

// MSA Certification client list
const msaClientListSchema = new schema.Entity('msaClientList', {}, {
  idAttribute: 'client_id',
})

// MSA Event list
const msaEventListSchema = new schema.Entity('msaEventList', {}, {
  idAttribute: 'id',
})

// MSA Client identity zone list
const msaClientIdentityZoneListSchema = new schema.Entity('msaClientIdentityZoneList', {}, {
  idAttribute: 'id',
})

// Schemas for tce API responses.
export const Schemas = {
  APM: apmSchema,
  APM_ARRAY: [ apmSchema ],
  APM_DATA: {
    data: apmSchema,
  },
  APM_ARRAY_DATA: {
    data: {
      apms: [ apmSchema ],
    },
  },
  SPRINGCLOUD_ARRAY_DATA: {
    data: {
      springcloud: [ springcloudSchema ],
    },
  },
  PROJECT_ARRAY_DATA: {
    data: [ projectSchema ],
  },
  CLUSTER_ARRAY_DATA: {
    data: {
      clusters: [ clusterSchema ],
    },
  },
  CLUSTERS_ARRAY_DATA: {
    clusters: [ clusterSchema ],
  },
  ALL_CLUSTERS_ARRAY_DATA: {
    clusters: [ clusterSchema ],
  },
  AUTH: authSchema,
  AUTH_DATA: {
    data: authSchema,
  },
  PP_APPS: ppAppsSchema,
  PP_APPS_ARRAY: [ ppAppsSchema ],
  MSALIST_ARRAY_DATA: {
    data: [ MsaList ],
  },
  GATEWAY_POLICIES_LIST_DATA: {
    data: {
      content: [ gatewayPolicies ],
    },
  },
  GATEWAY_ROUTES_LIST_DATA: {
    data: {
      content: [ gatewayRoutesSchema ],
    },
  },
  CSB_PUB_INSNTANCES_LIST_DATA: {
    data: {
      content: [ csbPubInstancesSchema ],
    },
  },
  CSB_AVA_INSNTANCE: {
    data: csbAvaInstancesSchema,
  },
  CSB_AVA_INSNTANCES_LIST_DATA: {
    data: {
      content: [ csbAvaInstancesSchema ],
    },
  },
  CSB_OM_INSNTANCES_LIST_DATA: {
    data: {
      content: [ csbOmInstancesSchema ],
    },
  },
  CSB_APPLY_LIST_DATA: {
    data: {
      content: [ csbApplySchema ],
    },
  },
  CSB_PUBLISHED_LIST_DATA: {
    data: {
      content: [ csbPublishedSchema ],
    },
  },
  CSB_SUBSCRIBE_LIST_DATA: {
    data: {
      content: [ csbSubscribeSchema ],
    },
  },
  CSB_INSTANCE_SERVICE_GROUP_LIST_DATA: {
    data: {
      content: [ csbInstanceServiceGroupsSchema ],
    },
  },
  CSB_INSTANCE_SERVICE_ACL_LIST_DATA: {
    data: {
      content: [ csbInstanceServiceACLSchema ],
    },
  },
  CSB_INSTANCE_SERVICE_DETAIL_LIST_DATA: {
    data: {
      content: [ csbInstanceServiceDetailSchema ],
    },
  },
  CSB_INSTANCE_CONSUMER_VOUCHER_LIST_DATA: {
    data: {
      content: [ csbInstanceConsumerVouchersSchema ],
    },
  },
  CSB__INSTANCE_CONSUMER_VOUCHER_UPDATE_DATA: {
    data: csbInstanceConsumerVouchersSchema,
  },
  CSB_INSTANCE_MY_SUBSCRIBED_SERVICES_LIST_DATA: {
    data: {
      content: [ csbInstanceMySubscribedServicesSchema ],
    },
  },
  CSB_INSTANCE_SERVICE_SUBSCRIBE_APPROVE_LIST_DATA: {
    data: {
      content: [ csbInstanceServiceSubscribeApproveSchema ],
    },
  },
  CSB_INSTANCE_SERVICE_API_DOC: {
    data: csbPublishedSchema,
  },
  CSB_INSTANCE_SERVICE_LIST_DATA: {
    data: {
      content: [ csbPublishedSchema ],
    },
  },
  CSB_CASCADING_LINK_RULE_LIST_DATA: {
    data: {
      content: [ csbCascadingLinkRuleSchema ],
    },
  },
  MSA_CLIENT_LIST_DATA: {
    resources: [ msaClientListSchema ],
  },
  MSA_EVENT_LIST_DATA: {
    data: {
      content: [ msaEventListSchema ],
    },
  },
  MSA_CLIENT_IDENTITY_ZONE_LIST_DATA: [ msaClientIdentityZoneListSchema ],
}
