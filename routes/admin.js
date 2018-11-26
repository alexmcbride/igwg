var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

// List of users...
var users = [];
users['Alex'] = { username: 'Alex', password_hash: '$2y$12$3X1JVCsN7UvMBSicg0RdoeNkiGb4qnKh8rPae.aO1gdLMkisr40KO' };

function sendJsonResponse(obj) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));
  res.end();
}

router.get('/login', function (req, res, next) {
  if (req.session.logged_in) {
    var user = users[req.session.username];
    sendJsonResponse({
      logged_in: true,
      user: user
    });
  } else {
    sendJsonResponse({
      logged_in: false,
    });
  }
});

router.post('/login', function (req, res, next) {
  var username = req.params.username;
  var password = req.params.password;

  var user = users[username];
  if (user === undefined) {
    sendJsonResponse({
      logged_in: false
    });
  } else {
    bcrypt.compare(password, user.password_hash, function (error, result) {
      if (result) {
        req.session.logged_in = true;
        req.session.username = username;
        sendJsonResponse({
          logged_in: true,
          user: user
        });
      } else {
        sendJsonResponse({
          logged_in: false,
        });
      }
    });
  }
});

router.post('/logout', function (req, res, next) {
  req.session.logged_in = false;
  req.session.username = null;
  sendJsonResponse({
    logged_in: req.session.logged_in,
  });
});

router.post('/posts', function (req, res, next) {
  if (req.session.logged_in) {
    // add post to JSON payload and write to disk
    sendJsonResponse({
      success: true, post: {

      }
    });
  } else {
    sendJsonResponse({ success: false });
  }
});

module.exports = router;
