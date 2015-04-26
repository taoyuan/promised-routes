'use strict';

let Q       = require('q'),
    request = require('request')

let BASE = 'http://localhost:3000'

module.exports = {
  get: (path) => {
    let pget = Q.nbind(request.get, request)
    return pget(BASE + path).get(0)
  },

  post: (path) => {
    let ppost = Q.nbind(request.post, request)
    return ppost(BASE + path).get(0)
  }

}
