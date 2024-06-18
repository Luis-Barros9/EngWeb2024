var express = require('express');
var router = express.Router();
var Compositor = require("../controllers/compositor")
var Periodo = require("../controllers/periodo")
var axios = require('axios')

function collectRequestBodyData(request, callback) {
  if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
      let body = '';
      request.on('data', chunk => {
          body += chunk.toString();
      });
      request.on('end', () => {
          callback(parse(body));
      });
  }
  else {
      callback(null);
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  let d = new Date().toISOString().substring(0, 16)
  Compositor.list()
  .then(response => {
      Periodo.list().then(response2 => {
          let dictPeriodos = {}
          res.status(200).jsonp(response2)
          for (let i = 0; i < response2.data.length; i++)
          {
              dictPeriodos[response2.data[i].id] = response2.data[i].nome
          }

          res.status(200).render('compositorListPage',{"compositores": response.data, "listaPeriodos": dictPeriodos,"date":d})
      }).catch(function(error){
          res.status(501).render('error', {"error": error})
    })

  })
  .catch(function(error){
        res.status(502).render('error', {"error": error})
  })
});

router.get('/registo', function(req, res, next) {
  let d = new Date().toISOString().substring(0, 16)
  console.log(`${link}/Periodos?_sort=nome`)
  axios.get(`${link}/Periodos?_sort=nome`).
  then(response => {
      res.status(200).render('compositorCreatePage', {"listaPeriodos": response.data,'date':d})
  }).
  catch(function(error){
      res.status(505).render('error', {"error": error})
  })

});

router.get('/:idCompositor', function(req, res, next) {
  let d = new Date().toISOString().substring(0, 16)
  let idCompositor = req.params.idCompositor
  console.log
  console.log(`${link}/Compositores/` + idCompositor)
  axios.get(`${link}/Compositores/` + idCompositor)
      .then(response => {
          axios.get(`${link}/Periodos/${response.data.periodo}`).then(response2 => {
              res.status(200).render('compositorPage', {"compositor": response.data, "periodo": response2.data,"date":d})
          }).catch(function(error){
              res.status(503).render('error', {"error": error})
          })
      })
      .catch(function(error){
          res.status(504).render('error', {"error": error})
      })
});

router.get('/edit/:idCompositor', function(req, res, next) {
  let idCompositor = req.params.idCompositor
  let d = new Date().toISOString().substring(0, 16)
  console.log(`${link}/Compositores/` + idCompositor)
  axios.get(`${link}/Compositores/` + idCompositor)
      .then(response => {
          axios.get(`${link}/Periodos?_sort=nome`).then(response2 => {
              nomePeriodo = ''
              
              for (let i = 0; i < response2.data.length; i++)
              {
                  if (response2.data[i].id == response.data.periodo)
                      nomePeriodo = response2.data[i].nome
              }
              console.log(response2.data.length)
              res.status(200).render('compositorEditPage', 
              {"compositor": response.data, "listaPeriodos": response2.data, 
              "nomePeriodo": nomePeriodo,"date":d})
          }).catch(function(error){
            res.status(506).render('error', {"error": error})
          })


      })
      .catch(function(error){
        res.status(507).render('error', {"error": error})
      })
});

router.post('/registo', function(req, res, next) {
  console.log("Entrei no registo de compositores")
  result = req.body
  console.log(result)
  result.id = result.id.toUpperCase()
  if (/C[1-9][0-9]*/i.test(result.id))
  {            
    axios.get(`${link}/Compositores?id=`+result.id)
    .then(response => {      
      if (response.data.length == 0){      
      axios.post(`${link}/Compositores`, result)
      .then(response => {

          res.status(200).redirect('/')
      })
      .catch(function(error){
          res.status(508).render('error', {"error": error})
      })
      }
      else
      {
        console.log("Compositor já existe")
        res.status(511).render('errorString', {"error": "Compositor já existe"})
      }
    })
    .catch(function(error){
      res.status(510).render('error', {"error": error})
    })
  }
  else 
  {
    res.status(509).render('error', {"error": "Id inválido"})
  }
});


router.post('/edit/:idCompositor', function(req, res, next) {
  result = req.body
  if (result)
  {                      
      axios.put(`${link}/Compositores/`+result.id, result)
      .then(resp =>{
        res.redirect('/compositores/'+result.id)        
      })
      .catch(function(error){
        res.status(513).render('error', {"error": error})
      })
  }
  else
  {
      res.status(512).render('error', {"error": "Não foi possível obter os dados do body"})
  }
});

router.get('/delete/:idCompositor', function(req, res, next) {
  let id = req.params.idCompositor
  axios.delete(`${link}/Compositores/`+id)
      .then(response => {
          res.redirect("/")
      })
      .catch(function(error){
         res.status(514).render('error', {"error": error})
      })
});


module.exports = router;
