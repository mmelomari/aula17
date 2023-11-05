const express = require('express');//carregou o express
const route = express.Router();

const homeController = require('./src/controllers/homeController');//ta importando tudo que tem em homeController
const loginController = require('./src/controllers/loginController');//ta importando tudo que tem em homeController
const contatoController = require('./src/controllers/contatoController');//ta importando tudo que tem em homeController

const { loginRequired } = require('./src/middlewares/middleware');

//rotas da home
//depois de responder o cliente, ainda podemos fazer algo, que é o caso da function da linha
route.get('/', homeController.index);

//Rotas de login
route.get('/login/index', loginController.index);//index é a pagina inicia da rota
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);


//Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/index/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);


module.exports = route;//exportando todas as rotas

