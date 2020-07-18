const jwt = require('jsonwebtoken');
const { key } = require('./claves.js')
const User = require('./user');
let token;

function checkToken(req, res, next){
    token = req.get('x-auth');
    token = (token==undefined && req.cookies.token)?req.cookies.token : token;
    if(token){
        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
          }
    
        localStorage.setItem('tokenUser',token)
        
        jwt.verify(token, key, function(err, payload){
            if(err){
                res.status(401).send({error: "token inválido."});
            }else{
                console.log("payload:");
                console.log(payload);
                req.Correo = payload.Correo;
                req.uid = payload.uid;
                next();
            }
        });
    }else{
        res.status(401).send({error: "No está autorizado."})
    }
}

async function checkRol(req,res,next){
    const correo = req.Correo;
    console.log("correo: ",correo)
    let user = await User.getUser(correo);
    if(user.Rol == 'ADMIN'){
        next();
    }else{
        res.status(401).send({error:"Información reservada para administrador."})
    }
}

module.exports={checkToken, checkRol};