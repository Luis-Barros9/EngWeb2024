var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoa")

/* GET users listing. */
router.get('/', function(req, res, next) {
    Pessoa.getModalidades().then(dados => {res.status(200).jsonp(dados);console.log(dados)})
        .catch(erro => res.status(500).jsonp(erro))

});

router.get('/:modalidade', function(req, res, next) {
    Pessoa.getPessoasModalidade(req.params.modalidade).then(dados => res.status(200).jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router;
