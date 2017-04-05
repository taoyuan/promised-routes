# Promised routing

[![Build Status](https://travis-ci.org/taoyuan/promised-routing.svg?branch=master)](https://travis-ci.org/taoyuan/promised-routing)
[![npm version](https://badge.fury.io/js/promised-routing.svg)](http://badge.fury.io/js/promised-routing)

Dead simple ExpressJS routes for developers using promises.


## Motivation

You know how funny it can be to code asynchronously?

```javascript
app.get('/my/route/:id', function(req, res) {
  findObjFromDb(req.params.id, function(err, obj) {
    if (err) {
      res.status(500).send(err.toString())
    } else {
      findAnotherObjFromDb(data, function(err, another) {
        if (err) {
          res.status(500).send(err.toString())
        } else {
          res.json({obj: obj, another: another})
        }
      })
    }
  })
})
``` 

Terrible? Definitely.

Ok, promises can make your async life a little bit easier:

```javascript
app.get('/my/route/:id', function(req, res) {
  findObjFromDb(req.params.id)
    .then(findAnotherObjFromDb)
    .then(function(combined) {
      res.json(combined)
    }
    .catch(function(error) {
      res.status(500).send(error.toString())
    })
    .done()
})
```

Well, that looks like a lot better! However, there is still some boilerplate
in that code: the last `then`, `catch` and `done` are basically same for all
routes. Doh!

Here `promised-routing` comes to rescue:

```javascript
var routing = require('promised-routing')
...
app.get('/my/route/:id', routing.json(function(req) {
  return findObjFromDb(req.params.id)
    .then(findAnotherObjFromDb)       
}))
```

Simple, lightweight, tested and beautiful.

:+1:


## API

#### `.json((request [, response]) => value|promise(value)) => routeHandler`

Creates an `express` route that returns `Content-Type: application/json` with 
200 code and JSON body. The returned JSON body can be wrapped to promise so 
that it'll be sent asynchronously when the promise completes.

```javascript
var routing   = require('promised-routing'),
    Bluebird = require('bluebird')

app.get('/tsers/:name', routing.json(function(req) {
  return Bluebird.resolve({msg: 'Tsers ' + req.params.name + '!'})
}))
```

### `.jsonp((request[, response]) => value|promise(value)) => routeHandler`

Behaves exactly same like `.json(..)` but uses `res.jsonp` for response sending
instead of `res.json`. All express configurations to Express application apply here.


#### `.custom(mimeType, (request [, response]) => value|promise(value)) => routeHandler`

Creates an `express` route that returns the user selected mime type as
response's `Content-Type`. The body is returned with `response.send()` so
all `express` supported types can be returned. Like in JSON routes, both
synchronous and asynchronous (= promises) values are supported.

```javascript
var routing   = require('promised-routing')

app.get('/tsers/:filename', routing.custom('application/octet-stream', function(req, res) {
  res.set('Content-Disposition', 'attachment;filename=' + req.params.filename)
  return new Buffer('tsers!', 'utf8')
}))
```


#### `.configure(opts) => routing`

Creates a new routing object with overridden options. 

```javascript
var routing = require('promised-routing')

var custom = routing.configure({errorHandler: function(res, error) { res.status(200).send('ok?') }})

app.get('/my/route', custom.json(function(req) {
  // ...
}))
``` 
