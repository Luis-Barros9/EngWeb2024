var express = require('express');
var router = express.Router();
var axios = require('axios');

const link = "http://localhost:3000"


/* GET periods listing. */
router.get('/', function(req, res, next) {
  let d = new Date().toISOString().substring(0, 16)
  axios.get(`${link}/Periodos?_sort=nome`)
  .then(response => {
          res.status(200).render('periodosListPage',{"listaPeriodos": response.data,"date":d})
      }).catch(function(error){
          res.status(521).render('error', {"error": error})
    })
});

router.get('/registo', function(req, res, next) {
    let d = new Date().toISOString().substring(0, 16)
    res.status(200).render('periodoCreatePage', {'date':d})

});

router.get('/:idPeriodo', function(req, res, next) {
  let d = new Date().toISOString().substring(0, 16)
  let idPeriodo = req.params.idPeriodo

  axios.get(`${link}/Periodos/` + idPeriodo)
      .then(response => {
          axios.get(`${link}/Compositores?periodo=${response.data.id}`).then(response2 => {
              res.status(200).render('periodPage', {"periodo": response.data, "listaCompositores": response2.data,"date":d})
          }).catch(function(error){
              res.status(523).render('error', {"error": error})
          })
      })
      .catch(function(error){
          res.status(524).render('error', {"error": error})
      })
});

router.get('/edit/:idPeriodo', function(req, res, next) {
    console.log("entrou")
    let idPeriodo = req.params.idPeriodo
    let d = new Date().toISOString().substring(0, 16)
    axios.get(`${link}/Periodos/` + idPeriodo)
      .then(response => {
            console.log(response.data)
              res.status(200).render('periodEditPage', {"periodo": response.data, "date":d})
      })
      .catch(function(error){
        res.status(525).render('error', {"error": error})
      })
});

router.post('/registo', function(req, res, next) {

  result = req.body
  console.log(result)
  result.id = result.id.toLowerCase()
  if (/p[1-9][0-9]*/i.test(result.id))
  {            
    console.log("Entrei no registo de periodos")
    axios.get(`${link}/Periodos?id=`+result.id)
    .then(response => {      
        axios.get(`${link}/Periodos?nome=`+result.nome).then(response2 => {
        if (response.data.length == 0 && response2.data.length == 0){ 
            console.log("Não existe")     
            axios.post(`${link}/Periodos`, result)
            .then(response => {

                res.status(200).redirect('/periodos/'+result.id)
            })
            .catch(function(error){
                res.status(526).render('error', {"error": error})
            })
        }
        else
        {
            console.log("Compositor já existe")
            res.status(527).render('errorString', {"error": "Compositor já existe"})
        }
        })
        .catch(function(error){
            res.status(530).render('error', {"error": error})
        })
    })
    .catch(function(error){
      res.status(528).render('error', {"error": error})
    })
  }
  else 
  {
    res.status(529).render('error', {"error": "Id inválido"})
  }
});


router.post('/edit/:idPeriodo', function(req, res, next) {
  result = req.body
  if (result)
  {
    axios.get(`${link}/Periodos?nome=`+result.nome).then(response => {   
        if (response.data.length > 0)
        {
            res.status(534).render('errorString', {"error": "Já existe um periodo com esse nome"})
        }   
        else
        {
            axios.put(`${link}/Periodos/`+result.id, result)
            .then(resp =>{
                res.redirect('/periodos/'+result.id)        
            })
            .catch(function(error){
                res.status(533).render('error', {"error": error})
            })
        }
    }).catch(function(error){
        res.status(531).render('error', {"error": error})
    })
  }
  else
  {
      res.status(532).render('error', {"error": "Não foi possível obter os dados do body"})
  }
});

router.get('/delete/:idPeriodo', function(req, res, next) {
  let id = req.params.idPeriodo
  axios.delete(`${link}/Periodos/`+id)
      .then(response => {
          res.redirect("/periodos")
      })
      .catch(function(error){
         res.status(535).render('error', {"error": error})
      })
});


module.exports = router;