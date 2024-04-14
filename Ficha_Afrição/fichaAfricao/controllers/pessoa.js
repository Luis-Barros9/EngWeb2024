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

module.exports.getModalidades = () => {
    return Pessoa.aggregate([
        {$project: {_id:0, desportos: 1}},
        {$unwind: "$desportos"},
        {$group: {_id:null, uniqueDesportos: {$addToSet: "$desportos"}}},
        {$unwind: "$uniqueDesportos"},
        {$sort: {uniqueDesportos: 1}},
        {$group: {_id:null, desportos: {$push: "$uniqueDesportos"}}},
        {$project: {_id:0, desportos: 1}}
    ]).exec()
}

module.exports.getPessoasModalidade = modalidade => {
    return Pessoa.
        find({desportos: {$in: [modalidade]}})
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