# Promised routes

[![Build Status](https://travis-ci.org/milankinen/promised-routes.svg?branch=master)](https://travis-ci.org/milankinen/promised-routes)
[![npm version](https://badge.fury.io/js/promised-routes.svg)](http://badge.fury.io/js/promised-routes)

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

Here `promised-routes` comes to rescue:

```javascript
var routes = require('promised-routes')
...
app.get('/my/route/:id', routes.json(function(req) {
  return findObjFromDb(req.params.id)
    .then(findAnotherObjFromDb)       
}))
```

Simple, lightweight, tested and beautiful.

:+1:
