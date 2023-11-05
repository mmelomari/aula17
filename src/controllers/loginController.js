const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    res.render('login');
};

exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);//exibindo uma mensagem de erro com uma flash msg, que aparece e some
            req.session.save(function() { //salvando a sessão 
                res.redirect('/login/index');// - Redireciona p pag de login
            });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso');//exibindo uma mensagem de erro com uma flash msg, que aparece e some
                req.session.user = login.user;
        req.session.save(function() { //salvando a sessão 
           return res.redirect('/login/index');// - Redireciona p pag de login
        });     
    } catch (e) {
        console.log(e);
        return res.render('404');
    }    
};




exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);//exibindo uma mensagem de erro com uma flash msg, que aparece e some
            req.session.save(function() { //salvando a sessão 
                res.redirect('/login/index');// - Redireciona p pag de login
            });
            return;
        }

        req.flash('success', 'Você entrou no sistema.');//exibindo uma mensagem de erro com uma flash msg, que aparece e some
        req.session.user = login.user;
        req.session.save(function() { //salvando a sessão 
           return res.redirect('/login/index');// - Redireciona p pag de login
        });     
    } catch (e) {
        console.log(e);
        return res.render('404');
    }    
};


exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};