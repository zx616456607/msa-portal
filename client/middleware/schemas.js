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
  idAttribute: 'serviceName',
})

// GatewayAllPolicesList
const gatewayPolicies = new schema.Entity('gatewayPolicies', {}, {
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
}
