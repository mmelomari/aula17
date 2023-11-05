//outra forma de escrever
exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');//se usa isso para injetar dados em todas as rotas
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};


exports.outroMiddleware = (req, res, next) => {
    next();
};

exports.checkCsrfError = (err, req, res, next) => {
    if(err) {
        return res.render('404');//se ocrrer o erro vai renderizar a página 404
    }
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

//checando para ver se ta logado e só poderá acessar a página de criar contato quem está logado
exports.loginRequired = (req, res, next) => {
    if(!req.session.user) {
        req.flash('errors', 'Você precisa fazer login.');
        req.session.save(() => res.redirect('/'));
        return;
    }
    next();
};