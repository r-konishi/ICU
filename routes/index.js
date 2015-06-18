var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {
    header: {
      title: 'ICU'
    },
    body: {
      h1: 'Upload Image (Ajax) and Compress Image on Canvas (HTML5)'
    }
  };
  res.render('index', data);
});

module.exports = router;
