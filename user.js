const mongoose = require("./mongodb-connect.js");
const bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
    uid: {
        type: Number,
        required: false,
        unique: true
    },
    Nombre: {
        type: String,
        required: true
    },
    Apellido: {
        type: String,
        required: true
    },
    Correo: {
        type: String,
        required: true,
        unique: true
    },
    Sexo: {
        type: String,
        required: false,
        enum: ['F', 'M'],
        default: 'F'
    },
    Edad: {
        type: String,
        required: false
    },
    Url: {
        type: String,
        required: false
    },
    Password: {
        type: String,
        required: true
    },
    Favoritos: {
        type: Array,
        required: false,
        unique: false
    },
    Rol: {
        type: String,
        required: false,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
});

userSchema.statics.getUsers = function(skip, limit){
    return user.find({},{_id:0, Nombre:1, Apellido:1, Correo:1, Sexo:1, Edad:1})
               .skip(skip)
               .limit(limit);
}

userSchema.statics.getUser = function(correo){
    return user.findOne({Correo: correo},{_id:1, uid:1, Nombre:1, Apellido:1, Correo:1, Sexo:1, Edad:1, Favoritos:1, Password:1, Rol:1});
}

userSchema.statics.getUserByUid = function(uid){
    return user.findOne(
        {uid: uid}, 
        {_id:0, Nombre:1, Apellido:1, Correo:1, Sexo:1, Edad:1, Favoritos:1, Password:1});
}

userSchema.statics.getRecetasFav = function(skip, limit, uid){
    return user.findOne({uid: uid},{_id:0, Favoritos:1})
                 .skip(skip)
                 .limit(limit);
}

userSchema.statics.deleteUser = function(correo){
    return user.findOneAndRemove(
        {Correo: correo},
        {new:true,
        useFindAndModify:false})
}

userSchema.statics.createUser = (userData)=>{
    userData.uid = Date.now();
    userData.Password = bcrypt.hashSync(userData.Password, 8);
    console.log("hash: ", userData.Password);

    /*if (userData.Url==undefined || userData.Url==''){
        userData.Url = `https://randomuser.me/api/portraits/${userData.Sexo=="M"?"men":"women"}/${userData.uid % 100}.jpg`
    }*/
    console.log(userData);
    userData.Rol = "USER";
    let newUser = user(userData);
    return newUser.save();
}

userSchema.methods.changeUser = function(newData){
    return user.findOneAndUpdate(
        {Correo:this.Correo},
        {$set:newData},
        {new:true,
        useFindAndModify:false})
}

userSchema.methods.addFavorito = function(_id){
    return user.findOneAndUpdate(
        {_id:this._id},
        {new:true,
        useFindAndModify:false})
}

let user = mongoose.model('users',userSchema);

module.exports = user;