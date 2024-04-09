var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoa")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res) {
  console.log(req.body)
  Pessoa.insert(req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

module.exports = router;
