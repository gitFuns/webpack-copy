"use strict"

module.exports = class WebpackError extends Error {_
  inspect() {
    return this.stack + (this.details ? `\n${this.details}` : '')
  }
}