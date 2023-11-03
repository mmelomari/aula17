//outra forma de escrever
exports.middlewareGlobal = (req, res, next) => {
    res.locals.umaVariaveLocal = 'Este é o valor da variável local.';//se usa isso para injetar dados em todas as rotas
    next();
};


exports.outroMiddleware = (req, res, next) => {
    next();
};

exports.checkCsrfError = (err, req, res, next) => {
    if(err && err.code === 'EBADCSRFTOKEN') {// Checando se tem algum erro de csrf
    //se existir algum erro & o erro do codigo for igual === a EBADCSRFTOKEN
        return res.render('404');//se ocrrer o erro vai renderizar a página 404
    }
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

