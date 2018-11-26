var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

// List of users...
var users = [];
users['Alex'] = { username: 'Alex', password_hash: '$2a$10$vemZcFLxAKdJySCdhHQZU.sySP5zb/bOOZvKxSi1chsqgZaJl/V8O' };

function jsonResponse(res, obj) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));
  res.end();
}

router.get('/logged_in', function (req, res, next) {
  if (req.session.logged_in) {
    jsonResponse(res, {
      logged_in: true,
      username: req.session.username
    });
  } else {
    jsonResponse(res, {
      logged_in: false,
    });
  }
});

router.post('/login', function (req, res, next) {
  var user = users[req.body.username];
  if (user === undefined) {
    console.log('User not found');
    jsonResponse(res, {
      logged_in: false
    });
  } else {
    bcrypt.compare(req.body.password, user.password_hash, function (error, result) {
      if (result) {
        console.log('Pass correct!');
        req.session.logged_in = true;
        req.session.username = req.body.username;
        jsonResponse(res, {
          logged_in: true,
          username: req.body.username
        });
      } else {
        console.log('Pass not correct');
        jsonResponse(res, {
          logged_in: false,
        });
      }
    });
  }
});

router.post('/logout', function (req, res, next) {
  req.session.logged_in = false;
  req.session.username = null;
  jsonResponse(res, {
    logged_in: false,
  });
});

router.post('/posts', function (req, res, next) {
  if (req.session.logged_in) {
    // add post to JSON payload and write to disk
    jsonResponse(res, {
      success: true, post: {

      }
    });
  } else {
    jsonResponse(res, { success: false });
  }
});

module.exports = router;
