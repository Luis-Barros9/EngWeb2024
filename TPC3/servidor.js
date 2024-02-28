var http  = require('http')
var url = require('url')
var axios = require('axios')
var fs  = require('fs')



http.createServer(function (req, res) {
    console.log(req.method + " " + req.url)

    if (req.url == '/') {
        fs.readFile('pag.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(data)
            res.end()
        })
    }
    else if(req.url == '/filmes'){
        axios.get('http://localhost:3000/ocorrencias').
        then( response => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            //res.write(genOcorrencias(response.data))
            res.write(JSON.stringify(response.data))
            res.end()
        }).catch(erro => {
            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
            res.write('<p> Erro: não consegui obter a lista de animais...' + erro + '</p>')
            res.end()
        })
    }
    else if(req.url == '/animais'){
            axios.get('http://localhost:3000/ocorrencias').
            then( response => {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(genOcorrencias(response.data))

                res.end()
            }).catch(erro => {
                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                res.write('<p> Erro: não consegui obter a lista de animais...' + erro + '</p>')
                res.end()
            })
    }
    else if (req.url == '/w3.css') {
        fs .readFile('w3.css', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(data)
            res.end()
        })
    }
    else{
        res.writeHead(400, {'Content-Type': 'text/html'})
        res.write('<p> Erro: pedido não suportado </p>')
        res.write('<pre>' + req.url +'</pre>')
        res.end()
    }
    

}).listen(8080)

console.log('link: http://localhost:8080')