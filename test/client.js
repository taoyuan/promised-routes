'use strict';

const Q = require('q');
const request = require('request');

const BASE = 'http://localhost:3000';

module.exports = {
  get: (path) => {
    const pget = Q.nbind(request.get, request);
    return pget(BASE + path).get(0)
  },

  post: (path) => {
    const ppost = Q.nbind(request.post, request);
    return ppost(BASE + path).get(0)
  }
};
