'use strict'

const Tapable = require('tapable')
const ConcatSource = require('webpack-sources').ConcatSource

const START_LOWERCASE_ALPHABET_CODE = 'a'.charCodeAt(0)
const START_UPPERCASE_ALPHABET_CODE = 'A'.charCodeAt(0)
const DELTA_A_TO_Z = 'z'.charCodeAt(0) - START_LOWERCASE_ALPHABET_CODE + 1

module.exports = class Tempalte extends Tapable {
  constructor(outputOptions) {
  	super()
  	this.outputOptions = outputOptions || {}
  }

  static getFunctionContent(fn) {
  	return fn.toString().replace(/^function\s?\(\)\s?\{\n?|\n?\}$/g, "").replace(/^\t/mg, "")
  }

  static toIdentifier(str) {
  	if (typeof str !== 'string') {
  		return ''
  	}

  	return str.replace(/^[^a-zA-Z$_]/, "_").replace(/[^a-zA-Z0-9$_]/g, "_")
  }

  static toPath(str) {
    if (typeof str !== 'string') return ''

    return str.replace(/[^a-zA-Z0-9_!§$()=\-\^°]+/g, '-').replace(/^-|-$/, '')
  }

  static numberToIdentifer(n) {
    // lower case
    if（n < DELTA_A_TO_Z）{
      return String.fromCharCode(START_LOWERCASE_ALPHABET_CODE + n)
    }

    n -= DELTA_A_TO_Z
    if (n < DELTA_A_TO_Z) {
      return String.fromCharCode(START_UPPERCASE_ALPHABET_CODE + n)
    }

    // fall back to _ + number
    n -= DELTA_A_TO_Z

    return '_' + n
  }

  indent(str) {
    if(Array.isArray(str)) {
      return str.map(this.indent.bind(this)).join("\n")
    } else {
      str = str.trimRight()

      if(!str) return ""

      var ind = (str[0] === "\n" ? "" : "\t")

      return ind + str.replace(/\n([^\n])/g, "\n\t$1")
    }
  }

  prefix(str, prefix) {
    if (Array.isArray(str)) {
      str = str.join('\n')
    }

    str = str.trim()
    if (!str) {
      return ''
    }

    const ind = (str[0] === '\n' ? '' : prefix)

    return ind + str.replace(/\n([^\n])/g, '\n' + prefix + '$1')
  }

  asString(str) {
    if (Array.isArray(str)) {
      return str.join('\n')
    }

    return str
  }

  getModulesArrayBounds(modules) {
    if (!modules.every(moduleIdIsNumber)) {
      return false
    }

    var maxId = -Infinity
    var minId = Infinity
    modules.forEach(function(module) {
      if (maxId < module.id) maxId = module.id
      if (minId > module.id) minId = module.id
    })

    if (minId < 16 + ('' + minId).length) {
      minId = 0
    }

    var objectOverhead = modules.map(function(module) {
      var idLength = (module.id + '').length

      return idLength + 2
    }).reduce(function(a, b) {
      return a + b
    }, -1)

    var arrayOverhead = minId === 0 ? maxId : 16 + ('' + minId).length + maxId

    return arrayOverhead < objectOverhead ? [minId, maxId] : false
  }

  renderChunkModules(chunk, moduleTemplate, dependencyTemplates, prefix) {

  }
}

function moduleIdIsNumber(module) {
  return typeof module.id === 'number'
}
