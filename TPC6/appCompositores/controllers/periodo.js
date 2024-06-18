var Periodo = require("../models/periodo")

module.exports.list = () => {
    return Periodo
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Periodo
        .findOne({_id : id})
        .exec()
}


module.exports.insert = Periodo => {
    var newPeriodo = new Periodo(Periodo)
    return newPeriodo.save()
}

module.exports.update = (id, Periodo) => {
    return Periodo
        .findByIdAndUpdate(id,Periodo,{new : true}).exec()
}