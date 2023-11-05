//foi criado c letra maiuscula pq geralmente o model vai ser uma classe

const mongoose = require('mongoose');
const validator = require('validator');

//isso modela os dados
const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },//o default serve para dizer, se não mandar um dado, salva como string vazia
    email: { type: String, required: false, default: '' },
    telefone: { type: String,  required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },//isso serve para salvar a data e hora em que foi criado
});

//criando o modo
//Contato é o nome do model e o esquema é ContatoSchema
const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}


Contato.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
};


Contato.prototype.valida = function() {
    this.cleanUp();
    //Validação

    //o email precisa ser valido
    //ta falando se for enviado um email, e ele nao for um email valido, coloca um erro na minha variável this.errors
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');    if(!this.body.nome) this.errors.push('Nome é um campo obrigátorio.');
    if(!this.body.email && !this.body.telefone) { // Se não for enviado email ou telefone, exiba o erro
        this.errors.push('Uma forma de contato precisa ser cadastrada: telefone ou e-mail.');
    }
};   

Contato.prototype.cleanUp = function() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {//garantindo que é uma string
        this.body[key] = '';//se não for string, converte p uma string vazia
      }
    }
  
    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    };
};


Contato.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}; 

//metódos estáticos - não tem acesso a palavra this
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.buscaContato = async function() {
    const contatos = await ContatoModel.find()
        .sort({criadoEm: -1});//ordenando pela ordem que foram criados de maneira decrescente
    return contatos;
};

Contato.delete = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato;
};

module.exports = Contato;

