const express = require('express');//carregou o express
const route = express.Router();
const homeController = require('./src/controllers/homeController');//ta importando tudo que tem em homeController
const contatoController = require('./src/controllers/contatoController');// - Outra página, outro controller


//rotas da home
//depois de responder o cliente, ainda podemos fazer algo, que é o caso da function da linha
route.get('/', homeController.paginaInicial);//isso quer dizer 'usa o meu homecontroler paginaInicial'
//o get achou a rota '/', passou no middleware meuMiddleware, e executou o resto dos parenteses (homeController.paginaInicial) 

route.post('/', homeController.trataPost);//criando outra rota
//o '/' é onde se fala a rota que quer, o resto dos parametros são middlewares(pode colocar uma função para executar executar alguma tarfe, uma função que chama outra função)

//rotas de contato
route.get('/contato', contatoController.paginaInicial)  //essa é a pagina inicial do contato, não é a mesma do home

module.exports = route;//exportando todas as rotas

