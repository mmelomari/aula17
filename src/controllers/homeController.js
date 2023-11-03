//esse home tem 2 middlewares (recebeu requisição, resposta e next)
exports.paginaInicial = (req, res) => {    
    res.render('index', {// - vai renderizar o template criado
        //titulo: 'Este será o <span style="color:red;"> título</span> da página',
        titulo: 'Este será o título da página',
        numeros: [0, 1, 2, 3, 4, 5, 6, 7]//injetando dados em um template só
    });
    return;
};

exports.trataPost = (req, res) => {
    res.send(req.body);
    return;
};

//o controler é o lugar onde vai ser criado as funções


