//foi criado c letra maiuscula pq geralmente o model vai ser uma classe

const mongoose = require('mongoose');
const validator = require('validator');
//validator foi  instalado (usando o comando npm i validator) para validar o email
const bcryptjs = require('bcryptjs');
//fazendo um rest de senha (não é criptografar), para a senha não aparecer no banco de dados caso ele seja hackeado
//p instalar npm i bcryptjs


//isso modela os dados
const LoginSchema = new mongoose.Schema({ //configurando o model
    //email e password são a configuração dos dados, nesse caso o email com o required: true ta dizendo que é obrigatório ser enviado
    email: { type: String, required: true },
    password: { type: String, required: true },
    
});

//criando o modo
//Login é o nome do model e o esquema é HomeSchema
const LoginModel = mongoose.model('Login', LoginSchema);

class Login { //recebendo os dados do login
    constructor(body) {
        this.body = body;//o body ta disponível em todos os métodos da classe
        this.errors = []; //diz que se tiver algum erro não pode criar o usuário na base de dados
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });
        
        if(!this.user) {
            this.errors.push('Usuário não existe.');
            return;
        }

        //validar a senha do usuário para ver se ele digitou a mesma cadastrada- mandou a senha como parâmetro
        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida.');
            this.user = null;
            return;
        }
    
    }

    async register() { //operações de base de dados tem que trabalhar com promisses, e para utilizar isso tem que ser um método async
        this.valida();
        if(this.errors.length > 0) return;
        //quando usar await, tem que envolver o que for await num try catch
        
        await this.userExists();// - Checando se o usuário existe

        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

                
        this.user = await LoginModel.create(this.body);
        
    }


    async userExists() { // - Checando se o usuário existe
        this.user = await LoginModel.findOne({ email: this.body.email });
        //o await diz que tem que esperar o loginmodel ocorrer
        if(this.user) this.errors.push('Usuário já existe');
    }

    valida() {
        this.cleanUp();
        //Validação

        //o email precisa ser valido
        //ta falando se nao for um email valido coloca um erro na minha variável this.errors
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        //a senha precisa ter entre 3 e 50 caracters
        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        }
    }   

    cleanUp() {
        for(const key in this.body) {
           if(typeof this.body[key] !== 'string') {//garantindo que é uma string
            this.body[key] = '';//se não for string, converte p uma string vazia
           }
        }

        this.body = {//garantindo que o obj tenha somente os campos que eu quero
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;

