var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

router.post('/uploadImage', function(req, res, next) {
  var form = new formidable.IncomingForm(); //Receive form
  form.encoding = 'utf-8';
  form.uploadDir = './public/images';
  form.maxFieldsSize = 2 * 1024 * 1024; // 2MB

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/html'});
    
    var responseData = {};
    if(err) {
      responseData = {
        status: 'error',
        errorMessage: err.toString()
      };    
    } else {
      responseData = {
        status: 'success',
        fileName: files.image.path.replace('public/images/' , '')
      };
    }
    
    res.end(JSON.stringify(responseData));
  });
});

module.exports = router;
