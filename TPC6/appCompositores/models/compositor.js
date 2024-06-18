var mongoose = require('mongoose');

var compositoresSchema = new mongoose.Schema({
    id: {type:String,
        required: true,
        unique: true},
    nome: String,
    dataNasc: String,
    dataObito: String,
    periodo: String,
    bio: String
},{versionKey: false});



module.exports = mongoose.model('compositores', compositoresSchema);