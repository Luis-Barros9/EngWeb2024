var Compositor = require("../models/compositor")

module.exports.list = () => {
    return Compositor
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Compositor
        .findOne({_id : id})
        .exec()
}


module.exports.findCompositoresByPeriodo = id => {
    return Compositor
        .findOne({periodo:id})
        .exec()
}



module.exports.insert = Compositor => {
    var newCompositor = new Compositor(Compositor)
    return newCompositor.save()
}

module.exports.update = (id, Compositor) => {
    return Compositor
        .findByIdAndUpdate(id,Compositor,{new : true}).exec()
}