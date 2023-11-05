//esse home tem 2 middlewares (recebeu requisição, resposta e next)
//o controler é o lugar onde vai ser criado as funções

const Contato = require('../models/ContatoModel');

exports.index = async(req, res) => { 
    const contatos = await Contato.buscaContato(); 
    res.render('index', { contatos });
};



