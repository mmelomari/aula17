//foi criado c letra maiuscula pq geralmente o model vai ser uma classe

const mongoose = require('mongoose');

//isso modela os dados
const HomeSchema = new mongoose.Schema({
    //titulo é a configuração dos dados, nesse caso o titulo com o required: true ta dizendo que é obrigatório ser enviado
    titulo: { type: String, required: true },
});

//criando o modo
//Home é o nome do model e o esquema é HomeSchema
const HomeModel = mongoose.model('Home', HomeSchema);

class Home {

}

module.exports = Home;

