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
}
