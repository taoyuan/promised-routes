'use strict';

let express    = require('express'),
    bodyParser = require('body-parser')


module.exports = (initRoutesCb, serverUpCb) => {
  let app = express()

  app.use(bodyParser.json())
  initRoutesCb(app)

  let server = app.listen(3000, () => serverUpCb())
  return {
    close: (cb) => { server.close(() => cb()) }
  }
}
