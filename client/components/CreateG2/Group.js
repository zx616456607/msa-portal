/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Create g2 chart group
 *
 * 2017-09-04
 * @author zhangpc
 */

import createG2 from './'

/**
 * Create g2 chart group
 *
 * @param {array} [__operations=[]] the opration array of create g2 chart
 * @param {bool} isSynchronized if make the chart group synchronized
 * @return {array} g2 chart group
 */
export default function CreateG2Group(__operations = [], isSynchronized) {
  const charts = {}
  const createOperation = (__operation, index) => {
    return (chart, configs) => {
      __operation.apply(this, [ chart, configs ])
      charts[index] = chart
      if (isSynchronized) {
        chart.on('plotmove', ev => {
          const point = {
            x: ev.x,
            y: ev.y,
          }
          Object.keys(charts).forEach(key => {
            if (key !== index) {
              charts[key].showTooltip(point)
            }
          })
        })
        // For hide other charts's tooltip when mouse leave the chart
        chart.on('plotleave', () => {
          Object.keys(charts).forEach(key => {
            if (key !== index) {
              charts[key].repaint()
            }
          })
        })
      }
    }
  }
  const Components = __operations.map((__operation, index) => {
    return createG2(createOperation(__operation, index))
  })
  return Components
}
