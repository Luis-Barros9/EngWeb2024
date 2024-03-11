// alunos_server.js
// EW2024 : 04/03/2024
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

const link = 'http://localhost:3000'
const linkSite = 'http://localhost:3050/'

// Aux functions
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

// Server creation

var alunosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    // Handling request
    if(static.staticResource(req)){
        console.log(req.method + " " + req.url)
        static.serveStaticResource(req, res)
    }
    else{
        console.log(req.method + " " + req.url)
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if (req.url == '/compositores' || req.url =='/'){
                    axios.get(`${link}/Compositores?_sort=nome`)
                        .then(response => {
                            axios.get(`${link}/Periodos`).then(response2 => {
                                let dictPeriodos = {}
                                for (let i = 0; i < response2.data.length; i++)
                                {
                                    dictPeriodos[response2.data[i].id] = response2.data[i].nome
                                }
                                pagHtml = templates.compositorcompListPage(dictPeriodos,response.data,d)
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(pagHtml)
                                res.end()
                            }).catch(function(error){
                                res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de períodos: " +error + "</p>")
                                res.end()
                            })

                        })
                        .catch(function(error){

                            res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de compositores: " +error + "</p>")
                            res.end()
                        })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if (/\/compositores\/(C[0-9]+$)/i.test(req.url)){
                    console.log("tou aqui")
                    var idCompositor = req.url.split("/")[2]
                    console.log(`${link}/Compositores/` + idCompositor)
                    axios.get(`${link}/Compositores/` + idCompositor)
                        .then(response => {
                            axios.get(`${link}/Periodos/${response.data.periodo}`).then(response2 => {

                                pagHtml = templates.compositorPage(response.data,response2.data.nome,d)
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(pagHtml)
                                res.end()
                            }).catch(function(error){
                                res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível obter o período do compositor: " +error + "</p>")
                                res.end()
                            })


                        })
                        .catch(function(error){
                            res.writeHead(504, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter o aluno: " +error + "</p>")
                            res.end()
                        })
                }
                // GET /compositores --------------------------------------------------------------------
                else if (req.url == '/periodos'){
                    axios.get(`${link}/Periodos?_sort=nome`)
                        .then(response => {
                            pagHtml = templates.periodocompListPage(response.data,d)          
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(pagHtml)
                            res.end()
                        })
                        .catch(function(error){
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de períodos: " +error + "</p>")
                            res.end()
                        })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if (/^\/periodos\/(p[0-9]+$)/i.test(req.url)){

                    var id = req.url.split("/")[2]
                    axios.get(`${link}/Periodos/` + id)
                        .then(response => {

                            axios.get(`${link}/Compositores?periodo=${response.data.id}`).then(response2 => {

                                pagHtml = templates.periodoPage(response2.data,response.data,d)
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(pagHtml)
                                res.end()
                            }).catch(function(error){
                                res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível obter o período do compositor: " +error + "</p>")
                                res.end()
                            })


                        })
                        .catch(function(error){
                            res.writeHead(504, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter o aluno: " +error + "</p>")
                            res.end()
                        })
                }
                // GET /alunos/registo --------------------------------------------------------------------
                else if (req.url == "/compositores/registo"){
                    console.log(`${link}/Periodos?_sort=nome`)
                    axios.get(`${link}/Periodos?_sort=nome`).
                    then(response => {
                        pagHtml = templates.compositorFormPage(response.data,d)
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(pagHtml)
                        res.end()
                    }).
                    catch(function(error){
                        res.writeHead(510, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.errorPage("Não foi possível obter a lista de períodos disponíveis",d))
                        res.end()
                    })

                }
                else if (req.url == "/periodos/registo"){
                    pagHtml = templates.periodoFormPage(d)
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(pagHtml)
                    res.end()

                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if ((/\/compositores\/edit\/C[0-9]+$/i).test(req.url)){
                    var idCompositor = req.url.split("/")[3]
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
                                console.log(nomePeriodo)
                                pagHtml = templates.compositorEditPage(response2.data,response.data,nomePeriodo,d)
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(pagHtml)
                                res.end()
                            }).catch(function(error){
                                res.writeHead(530, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de períodos: " +error + "</p>")
                                res.end()
                            })


                        })
                        .catch(function(error){
                            res.writeHead(531, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter o aluno: " +error + "</p>")
                            res.end()
                        })
                }
            
                // GET /alunos/delete/:id --------------------------------------------------------------------
                else if ((/\/compositores\/delete\/C[0-9]+$/i).test(req.url)){
                    idCompositor = req.url.split("/")[3]
                    axios.delete(`${link}/alunos/` + idCompositor)
                        .then(response => {
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Compositor eliminado com sucesso</p>")
                            res.end()
                        })
                        .catch(function(error){
                            res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.errorPage("Não foi possível eliminar o compositor",d))
                            res.end()
                        })
                }
                else if ((/\/periodos\/delete\/p[0-9]+$/i).test(req.url)){
                    idPeriodo = req.url.split("/")[3]
                    console.log(idPeriodo)
                    // Verificar se existem compositores associados a este periodo
                    axios.get(`${link}/Compositores?periodo=${idPeriodo}`).then(response => {
                        if (response.data.length > 0)
                        {
                            res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.errorPage("Não é possível eliminar o periodo pois existem compositores associados",d))
                            res.end()
                        }
                        else{
                            axios.delete(`${link}/Periodos/` + idPeriodo)
                            .then(response => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Periodo eliminado com sucesso</p>")
                                res.end()
                            })
                            .catch(function(error){
                                res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Não foi possível eliminar o período",d))
                                res.end()
                            })
                        }
                    }).catch(function(error){

                        res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.errorPage("Não foi possível eliminar o periodo",d))
                        res.end()
                    })
                }
                else if (/\/periodos\/edit\/p[0-9]+$/i.test(req.url)){
                    idPeriodo = req.url.split("/")[3]
                    axios.get(`${link}/Periodos/` + idPeriodo).then(response => {
                        pagHtml = templates.periodoFormEditPage(d,response.data)
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(pagHtml)
                        res.end()
                    })
                    .catch(function(error){
                        res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.errorPage("Não foi possível obter o periodo",d))
                        res.end()
                    })

                }
                // GET ? -> Lancar um erro
                else {
                    res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write("<p>GET request não suportado: " + req.url + "</p>" )
                    res.end()
                }
                break
            case "POST":
                // POST /alunos/registo --------------------------------------------------------------------
                if (req.url == "/compositores/registo"){
                    collectRequestBodyData(req, result => {
                        console.log(result.id)
                        if (result)
                        {
                            if (/C[1-9][0-9]*/i.test(result.id))
                            {                         
                                axios.get(`${link}/Compositores/${result.id}`).then(response => {
                                    console.log("Já existe um compositor com esse id")
                                    res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write(templates.errorPage("Id inválido",d))
                                }).
                                catch(function(error)
                                {
                                    axios.post(`${link}/Compositores`, result)
                                    .then(resp =>{
                                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                        res.write("<p>Compositor registado com sucesso" +JSON.stringify(resp.data) +"</p>")
                                        res.end()
                                    
                                    })
                                    .catch(function(error){
                                        res.writeHead(509, {'Content-Type': 'text/html; charset=utf-8'})
                                        res.write(templates.errorPage("Não foi possível registar",d))
                                        res.end()
                                    })
                                })
                            }
                            else 
                            {
                                res.writeHead(401, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Id inválido",d))
                            }
                        }
                        else
                        {
                            res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter os dados do body </p>" )
                            res.end()
                        }
                    })
                }
                else if (req.url == "/periodos/registo"){
                    collectRequestBodyData(req, result => {
                        
                        if (result)
                        {
                            result.id = result.id.toLowerCase()
                            if (/p[1-9][0-9]*/.test(result.id))
                            {                         
                                axios.get(`${link}/Periodos/${result.id}`).then(response => {
                                    console.log("Já existe um periodo com esse id")
                                    res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write(templates.errorPage("Id em uso",d))
                                }).
                                catch(function(error)
                                {
                                    axios.get(`${link}/Periodos?nome=${result.nome}`).then(response => {
                                        if (response.data.length > 0)
                                        {
                                            res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                                            res.write(templates.errorPage("Nome em uso",d))
                                        }
                                        else
                                        {
                                            axios.post(`${link}/Periodos`, result)
                                            .then(resp =>{
                                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                                res.write("<p>Periodo registado com sucesso" +JSON.stringify(resp.data) +"</p>")
                                                res.end()
                                            
                                            })
                                            .catch(function(error){
                                                res.writeHead(509, {'Content-Type': 'text/html; charset=utf-8'})
                                                res.write(templates.errorPage("Não foi possível registar",d))
                                                res.end()
                                            })
                                        }
                                    }).catch(function(error){
                                        res.writeHead(509, {'Content-Type': 'text/html; charset=utf-8'})
                                        res.write(templates.errorPage("Não foi possível validar nome repetido",d))
                                        })
                                })
                            }
                            else 
                            {
                                res.writeHead(401, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Id inválido",d))
                            }
                        }
                        else
                        {
                            res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter os dados do body </p>" )
                            res.end()
                        }
                    })
                }
                else if((/\/compositores\/edit\/C[0-9]+$/i).test(req.url))
                {
                    
                    collectRequestBodyData(req, result => {
                        console.log(result.id)
                        if (result)
                        {
                            if (/C[1-9][0-9]*/i.test(result.id))
                            {                         
                                axios.put(`${link}/Compositores/`+result.id, result)
                                .then(resp =>{
                                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write("<p>Compositor editado com sucesso" +JSON.stringify(resp.data) +"</p>")
                                    res.end()
                                
                                })
                                .catch(function(error){
                                    res.writeHead(509, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write(templates.errorPage("Não foi possível editar",d))
                                    res.end()
                                })
                            }
                            else 
                            {
                                res.writeHead(401, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Id inválido",d))
                            }
                        }
                        else
                        {
                            res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter os dados do body </p>" )
                            res.end()
                        }
                    })
                }
                else if((/\/periodos\/edit\/p[0-9]+$/i).test(req.url))
                {
                    
                    collectRequestBodyData(req, result => {
                        if (result)
                        {
                            axios.get(`${link}/Periodos?nome=`+result.nome).then(response => {      
                                if (response.data.length > 0)
                                {
                                    res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write(templates.errorPage("Nome em uso",d))
                                }
                                else
                                {              
                                    axios.put(`${link}/Periodos/`+result.id, result)
                                    .then(resp =>{
                                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                        res.write("<p>Periodo editado com sucesso" +JSON.stringify(resp.data) +"</p>")
                                        res.end()
                                    
                                    })
                                    .catch(function(error){
                                        res.writeHead(509, {'Content-Type': 'text/html; charset=utf-8'})
                                        res.write(templates.errorPage("Não foi possível editar",d))
                                        res.end()
                                    })
                                }
                            }).
                            catch(function(error){
                                {
                                    res.writeHead(401, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write(templates.errorPage("Id inválido",d))
                                }
                            })
                        }
                        else
                        {
                            res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter os dados do body </p>" )
                            res.end()
                        }
                    })
                }
                else{
                    res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write("<p>POST request não suportado: " + req.url + "</p>" )
                }

                break
                // POST ? -> Lancar um erro
            default: 
                console.log(req.method + " " + req.url)
                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                res.write("<p> Método não suportado: " + req.method + "</p>" )
                break
                // Outros metodos nao sao suportados
        }
    }
})

alunosServer.listen(3050, ()=>{
    console.log(linkSite)
})



