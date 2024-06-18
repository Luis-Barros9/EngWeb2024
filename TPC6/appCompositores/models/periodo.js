var mongoose = require('mongoose');

var periodosSchema = new mongoose.Schema({
    id: {type:String,
        required: true,
        unique: true},
    nome: String,
},{versionKey: false});



module.exports = mongoose.model('periodos', periodosSchema);