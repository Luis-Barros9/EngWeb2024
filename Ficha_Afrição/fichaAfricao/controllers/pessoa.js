var Pessoa = require("../models/pessoa")

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id : id})
        .exec()
}



module.exports.insert = pessoa => {
    var newPessoa = new Pessoa(pessoa)
    return newPessoa.save()
}

module.exports.update = (id, Pessoa) => {
    return Pessoa
        .findByIdAndUpdate(id,Pessoa,{new : true}).exec()
}