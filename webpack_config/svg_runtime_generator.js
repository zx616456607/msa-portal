/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Extracting runtime generator for svg-sprite-loader
 * based on https://github.com/kisenka/svg-sprite-loader/blob/master/lib/runtime-generator.js
 *
 * v0.1 - 2017-08-15
 * @author Zhangpc
 */

const { stringifyRequest } = require('loader-utils')
const {
  stringify,
  stringifySymbol,
  generateImport,
  generateExport,
  generateSpritePlaceholder,
} = require('svg-sprite-loader/lib/utils')

module.exports = function runtimeGenerator(params) {
  const { symbol, config, context } = params
  const { extract, esModule, spriteModule, symbolModule, runtimeCompat } = config

  if (extract) {
    const spritePlaceholder = generateSpritePlaceholder(symbol.request.file)

    // for https://github.com/kisenka/svg-sprite-loader/issues/123
    const id = stringify(symbol.useId).replace(/\-usage/, '')

    const data = `{
      id: ${id},
      viewBox: ${stringify(symbol.viewBox)},
      url: __webpack_public_path__ + ${stringify(spritePlaceholder)},
      toString: function () {
        return this.url
      }
    }`

    return generateExport(data, esModule)
  }
  const spriteModuleImport = stringifyRequest({ context }, spriteModule)
  const symbolModuleImport = stringifyRequest({ context }, symbolModule)

  return [
    generateImport('SpriteSymbol', symbolModuleImport, esModule),
    generateImport('sprite', spriteModuleImport, esModule),

    `var symbol = new SpriteSymbol(${stringifySymbol(symbol)})`,
    'var result = sprite.add(symbol)',

    generateExport(runtimeCompat ? '"#" + symbol.id' : 'symbol', esModule),
  ].join(';\n')
}
