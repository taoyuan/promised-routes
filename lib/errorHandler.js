'use strict';


module.exports = function(res, error) {
  res.status(500).send(error !== undefined && error !== null ? error.toString() : '')
}
