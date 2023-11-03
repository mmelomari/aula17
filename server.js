require('dotenv').config();// PEDIU p dotenv ser config - digita isso e cria um arquivo .env na pasta geral
const express = require('express');
const app = express();
const mongoose = require('mongoose'); 

mongoose.connect(process.env.CONNECTIONSTRING)//Modela a base de dados
    .then(() => { //Para ele conectar na base de dados primeiro e depois começar a escutar, se usa esse then
        console.log('Conectei a base de dados');
        app.emit('pronto');//a conexão só ocorre quando o app emitir o sinal de 'pronto'
    })
    .catch(e => console.log(e));//exibe o erro

const session = require('express-session');// - Chamou a session 
/*session- usado para identificar o navegador de um cliente, o programa salva um cookie, com um id do cookie no pc do cliente e toda vez que ele
conectar no servidor ele manda esse cookie p nosso servidor, p nosso servidor checa e falar 'esse cliente é o joao, que ja conectou anteriormente, 
posso confiar'*/

const MongoStore = require('connect-mongo');//falar que as sessoes serão salvas na base de dados, pois por padrão elas são salva em memória(se usar o padrão a memória acaba rápido)
const flash = require('connect-flash');//mensagens auto-destrutivas, ideal para mandar mensagem de erro
const routes = require('./routes');//importando o arquivo de rotas
const path = require('path');//caminhos

const helmet = require('helmet');/* É uma biblioteca Node.js recomendada pelo express, é usada para melhorar a segurança de aplicativos web Express.js. 
Ela fornece um conjunto de middlewares que ajudam a proteger seu aplicativo contra várias vulnerabilidades e ameaças de segurança comuns na web.
- Instalar o helmet - npm i helmet */

const csrf = require('csurf'); 
/* São tokens que criamos para nossos formulários que fazem com que nenhum site externo consiga acessar nosso código.
- Ele previne contra ações não autorizadas, ataques, promove segurança para formulários e solicitações seguras, é a conformidade com as melhores práticas
de segurança, atua na redução do risco de exploração de vulnerabilidades
Instalar o csrf - npm i csurf  */

const { middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware');//importando o middleware
//middleware são funções que são executadas na rota(são executadas no meio do caminho p resposta do cliente)

app.use(helmet());
app.use(express.urlencoded({extended:true}));//fala que pode postar formulário p dentro da nossa aplicação

app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'public')));

//configurando a sessão
const sessionOptions = session({
    secret: 'jfjkcmsackma',//escreve o que quiser
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }), //store - fala onde vai salvar a sessão, e dentro manda o cliente de conexão do mongodb, nesse caso o moongose
    resave: false,//diz ao middleware que ele não deve salvar a sessão a cada requisição
    saveUninitialized: false, //diz ao middleware que ele não deve salvar uma sessão que ainda não foi inicializada. Isso ajuda a evitar erros
    cookie: {//fala quanto tempo a sessão vai durar
        maxAge: 1000 * 60 * 60 * 24 * 7,//quanto tempo em milésimo de segundos- essa sessão dura 7 dias
        //1000 * 60 * 60 = 1 hora
        httpOnly:true /*serve para tornar o cookie inacessível para scripts JavaScript no navegador. Quando um cookie é marcado como "httpOnly", isso significa que ele 
        só pode ser acessado e manipulado pelo servidor web e não por código JavaScript em execução na página.Se os cookies de sessão não forem marcados como "httpOnly",
        um invasor pode acessá-los, comprometendo a segurança da sessão do usuário e potencialmente assumindo o controle da conta. */ 
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));//falar pro express que precisa utilizar essa pasta como views, ai passou o caminho
app.set('view engine', 'ejs');

//Nossos própios middlewares
app.use(csrf());
app.use(middlewareGlobal);//ta disponivel p ser usada em todos os locais pois não enviou rota
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes);//falou p o express usar minhas rotas

//app.on ta capturando o sinal do emit
app.on('pronto', () => {
    app.listen(3000, () => { 
        console.log('Servidor executando na porta 3000')
        console.log('Acessar http://localhost:3000');
    });     
});



