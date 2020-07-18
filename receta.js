const mongoose = require("./mongodb-connect");

let recetaSchema = mongoose.Schema({
    uid: {
        type: Number,
        required: false,
        unique: false
    },
    Imagen: {
        type: String,
        required: false,
        unique: false
    },
    Nombre: {
        type: String,
        required: true,
        unique: true
    },
    Porciones: {
        type: String,
        required: true,
        unique: false
    },
    Ingredientes: {
        type: String,
        required: true,
        unique: false
    },
    Cantidades: {
        type: String,
        required: true,
        unique: false
    },
    Pasos: {
        type: String,
        required: true,
        unique: false
    },
    Categoria: {
        type: String,
        required: true,
        unique: false
    },
    Favoritos: {
        type: Boolean
    }
});

recetaSchema.statics.getRecetas = function(skip, limit, uid){
    return receta.find({uid: uid},{_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Categoria:1})
                 .skip(skip)
                 .limit(limit);
}

recetaSchema.statics.getRecetasByCategoria = function(skip, limit, uid, Categoria){
    return receta.find({uid: uid, Categoria: Categoria},{_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Categoria:1})
                 .skip(skip)
                 .limit(limit);
}

recetaSchema.statics.getRecetasByFavoritos = function(skip, limit, uid){
    return receta.find({uid: uid, Favoritos: true},{_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Categoria:1})
                 .skip(skip)
                 .limit(limit);
}

recetaSchema.statics.getRecetasByIngrediente = function(skip, limit, uid, Ingredientes){
    return receta.find({uid: uid, Ingredientes: new RegExp(Ingredientes, 'i')},{_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Categoria:1})
                 .skip(skip)
                 .limit(limit);
}

recetaSchema.statics.getRecetasByNombre = function(skip, limit, uid, Nombre){
    return receta.find({uid: uid, Nombre: new RegExp(Nombre, 'i')},{_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Categoria:1})
                 .skip(skip)
                 .limit(limit);
}

recetaSchema.statics.getReceta = function(_id){
    return receta.find({_id: _id}, {_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Cantidades:1, Pasos:1, Categoria:1});
}

recetaSchema.statics.getRecetaNombre = function(Nombre){
    return receta.find({Nombre: Nombre}, {_id:1, Nombre:1, Imagen:1, Porciones:1, Ingredientes:1, Categoria:1});

}

recetaSchema.statics.deleteReceta = function(_id){
    return receta.findOneAndRemove(
        {_id: _id},
        {new:true,
        useFindAndModify:false})
}

recetaSchema.statics.createReceta = (Data, uid)=>{
    Data.uid = uid;
    console.log(Data);
    let newReceta = receta(Data);
    return newReceta.save();
}

recetaSchema.methods.changeReceta = function(newData){
    return receta.findOneAndUpdate(
        {Nombre:this.Nombre},
        {$set:newData},
        {new:true,
        useFindAndModify:false})
}

let receta = mongoose.model('recetas',recetaSchema);
module.exports = receta;