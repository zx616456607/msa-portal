export const componentData = [
  {
    kind: 'DestinationRule',
    apiVersion: 'networking.istio.io/v1alpha3',
    metadata: {
      name: 'lalala',
      namespace: 'all',
      resourceVersion: '26244595',
      creationTimestamp: null,
      annotations: {
        'svcName/box-srv': 'v1',
      },
    },
    spec: {
      host: 'lalala',
      subsets: [
        {
          labels: {
            version: 'v1',
          },
          name: 'v1',
        },
        {
          labels: {
            version: 'v2',
          },
          name: 'v2',
        },
        {
          labels: {
            version: 'v3',
          },
          name: 'v3',
        },
      ],
      trafficPolicy: {
        tls: {
          mode: 'ISTIO_MUTUAL',
        },
      },
    },
  },
  {
    kind: 'DestinationRule',
    apiVersion: 'networking.istio.io/v1alpha3',
    metadata: {
      name: 'ppppp',
      namespace: 'all',
      resourceVersion: '33453322',
      creationTimestamp: null,
      annotations: {
        'svcName/box-srv': 'v2',
      },
    },
    spec: {
      host: 'ppppp',
      subsets: [
        {
          labels: {
            version: 'v0-1',
          },
          name: 'v0-1',
        },
        {
          labels: {
            version: 'v0-2',
          },
          name: 'v0-2',
        },
        {
          labels: {
            version: 'v0-3',
          },
          name: 'v0-3',
        },
      ],
      trafficPolicy: {
        tls: {
          mode: 'ISTIO_MUTUAL',
        },
      },
    },
  },
]
