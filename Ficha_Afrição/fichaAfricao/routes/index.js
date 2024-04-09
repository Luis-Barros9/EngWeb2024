var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoa")



/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/pessoa')
});


module.exports = router;
