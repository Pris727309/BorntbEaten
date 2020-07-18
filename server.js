const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3000;
const user = require('./user');
const receta = require('./receta');
const { key } = require('./claves.js');
const {checkToken} = require('./auth');
const {checkRol} = require('./auth');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

//app.use('/login', express.static(__dirname+"/public/interfaces/sign-in"));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/interfaces/sign-in"))
});
app.use('/registro',express.static(__dirname+"/public/interfaces/registro"));
app.use('/recetas',express.static(__dirname+"/public/interfaces/recetas"));
app.use('/perfil',express.static(__dirname+"/public/interfaces/perfil"));
app.use('/nvaReceta',express.static(__dirname+"/public/interfaces/nvaReceta"));
app.use('/editReceta',express.static(__dirname+"/public/interfaces/editReceta"));
app.use('/editPerfil',express.static(__dirname+"/public/interfaces/editPerfil"));
app.use('/detallesReceta',express.static(__dirname+"/public/interfaces/detallesReceta"));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get('/api/users',checkToken, checkRol, async (req, res) => { 
    console.log('entra a api/users');
    console.log(req.query);
    console.log("usuario logueado: ", req.Correo)
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 8;
    let skip;
    if(page === 0){
        skip = page;
    }else{
        skip = page * limit;
    }

    let docs = await user.getUsers(skip, limit);
    console.log(docs);
    res.json(docs);
});

//REGISTRARSE
app.post('/api/users', validar, async (req, res)=>{
    console.log("creando usuario");
    let doc = await user.getUser(req.body.Correo);
    if(doc){
        res.status(400).send({error: "Esta cuenta ya existe"})
    }else{
        try{
            let usr = await user.createUser(req.body);
            res.status(201).send(usr);
        }catch(err){
            res.status(400).send({error: err});
        }
    }
})

//ELIMINAR
app.delete('/api/users/:Correo', async(req, res)=>{
    let doc = await user.getUser(req.params.Correo);
    console.log(doc);
    if(doc){
        try{
            let usr = await user.deleteUser(req.params.Correo);
            res.status(201).send(`Eliminado: ${usr}`);
        }catch(err){
            res.status(400).send({error: err});
        }
    }else{
        res.status(404).send({error: "Esta cuenta no existe"})
    }
});

app.get('/api/user', checkToken, async (req, res)=>{
    console.log(req.params.Correo);
    let doc = await user.getUser(req.Correo);
    res.send(doc);
})

app.put('/api/user',checkToken, async (req, res)=>{
    let doc;
    try{
        doc = await user.getUser(req.Correo);
        console.log(doc);
        if(doc){
            await doc.changeUser(req.body);
            console.log("User Updated");
            res.send(doc);
            }
    }catch(err){
        res.status(404).send({error: "Este usuario no existe."})
    }
})

function validar(req, res, next){
    let {Nombre, Apellido, Correo, Password} = req.body;
    let usuario = user.getUser(Correo);
    console.log(usuario.Correo);
    if(usuario.Correo){
        res.status(400).send("Este correo ya está registrado")
    }else{
        if(Nombre && Apellido && Correo && Password){
            next();
            return
        }else{
            let falta = ''
                if(Nombre){}else{falta += ' nombre'};
                if(Apellido){}else{falta += ' apellido'};
                if(Correo){}else{falta += ' correo'};
                if(Password){}else{falta += ' password'};
                res.status(400).send({error: `Completa todos los campos requeridos, falta:  ${falta}`});
        }
    }
}

//LOGIN
app.route('/api/login') 
    .post(async (req, res)=>{
        console.log(req.body);
        let {Correo, Password} = req.body;
        let usr = await user.getUser(Correo);
        if (usr){
            console.log(usr.Password);
            if (bcrypt.compareSync(Password, usr.Password)){
                let token = jwt.sign({Correo:usr.Correo, uid:usr.uid}, key, {expiresIn: '2h'});
                res.cookie('token', token);
                res.redirect('/recetas');
            }else{
                res.redirect('/?error=Verifique su usuario y contraseña')
            }
        }else{
            res.status(404).send({error: "Usuario no existe"});
        }
    });

    app.post('/api/user/:uid/favoritos', async (req, res) => { 
        console.log('estas en api/usuario/:uid/favoritos');
        console.log("req.params-uid: ", req.params.uid);
        let uid = Number(req.params.uid)
        if(req.body._id){
            try{
                doc = await user.getUserByUid(uid);
                if(doc.Favoritos[0] == ''){
                    doc.Favoritos[0] = req.body._id
                    await doc.changeUser(doc);
                    res.send(doc);
                }else{
                    for(var i=0; i<doc.Favoritos.length; i++){
                        if (doc.Favoritos[i] == req.body._id){
                            res.status(400).send({error: "Esta receta ya existe en tu lista de favoritos"})
                            return
                        }
                    }
                    doc.Favoritos.push(req.body._id);
                    await doc.changeUser(doc);
                    res.send();
                    return
                }
            }catch(err){
                console.log(err)
                res.status(404).send({error: "Este usuario no existe."})
            }
        }else{
            res.status(404).send({error: "Falta el id de la receta"})
        }
    });

     //PERFIL DEL USUARIO
     app.get('/api/perfil', checkToken, async (req, res) => { 
        console.log('estas en api/perfil');
        let uid = req.uid;
        let filtro = await user.getUserByUid(uid);
        res.send(filtro);
    });

//------------------------------ RECETAS-------------------------------
    //HOME
    app.get('/api/recetas', checkToken, async (req, res) => { 
        console.log('estas en api/recetas');

        let uid = req.uid;
        let page = Number(req.query.page) || 0;
        let limit = Number(req.query.limit) || 3;
        let Categoria = req.query.Categoria;
        let Nombre = req.query.Nombre;
        console.log(Nombre);
        let Ingredientes = req.query.Ingredientes;
        console.log(Ingredientes);
        let Favoritos = req.query.Favoritos;
        let skip;

        if(page === 0){
            skip = page;
        }
        else{
            skip = page * limit;
        }

        console.log("skip: ", skip);
        console.log("limit: ", limit);
        console.log("page: ", page);

        let filtro = await receta.getRecetas(skip,limit,uid);

        if(Categoria){
            console.log("By Categoria");
            filtro = await receta.getRecetasByCategoria(skip,limit,uid,Categoria);
        }
        if(Ingredientes){
            console.log("By Ingrediente");
            filtro = await receta.getRecetasByIngrediente(skip,limit,uid,Ingredientes);
        }
        if(Nombre){
            console.log("By Nombre");
            filtro = await receta.getRecetasByNombre(skip,limit,uid,Nombre);
        }
        if(Favoritos){
            console.log("By Favoritos");
            filtro = await receta.getRecetasByFavoritos(skip,limit,uid);
        }
        res.send(filtro);
    });

    //DETALLE DE RECETA
    app.get('/api/detalleReceta/:_id', checkToken, async (req, res) => { 
        console.log('estas en api/detalleReceta');

        let _id = req.params._id
        console.log("_id: ",_id)

        let filtro = await receta.getReceta(_id);
        console.log(filtro);
        res.send(filtro);
    });

    //Edit DE RECETA
    app.get('/api/editReceta/:_id', checkToken, async (req, res) => { 
        console.log('estas en GET api/editReceta');

        let _id = req.params._id
        console.log("_id: ",_id)

        let filtro = await receta.getReceta(_id);
        console.log(filtro);
        res.send(filtro);
    });

    //EDITAR RECETA
    app.put('/api/editReceta/:_id', checkToken, validarRec, async (req, res)=>{
        console.log('estas en PUT api/editReceta');
        try{
            let doc = await receta.getReceta(req.params._id);
            console.log(doc[0]);
            
            if(doc[0]._id == req.params._id){
                console.log(doc[0]._id);
                console.log(req.params._id);
                let rec = await doc[0].changeReceta(req.body);
                console.log(rec);
                //res.redirect('/recetas');
                res.send(rec);
            }
        }catch(err){
            console.log(err);
            res.status(404).send({error: "Esta receta no existe."})
        } 
    })

    //NUEVA RECETA
    app.post('/api/recetas', checkToken, validarRec, async (req, res)=>{
        let doc = await receta.getRecetaNombre(req.body.Nombre);
        //console.log(typeof doc.Nombre);
        if(doc.length>0){
            res.status(400).send({error: "Ya existe una receta con este nombre"})
        }else{
            try{
                let rec = await receta.createReceta(req.body, req.uid);
                res.status(201).send(rec);
            }catch(err){
                res.status(400).send({error: err});
            }
        }
    })

    //FAVORITOS
    app.get('/api/recetas/favoritos/:uid', checkToken, async (req, res) => { 
        console.log('estas en api/recetas/favoritos');
        console.log(req.params.uid);
    
        let page = Number(req.query.page) || 0;
        let limit = Number(req.query.limit) || 8;
        let skip;
        if(page === 0){
            skip = page;
        }else{
            skip = page * limit;
        }
    
        let doc = await user.getRecetasFav(skip, limit, req.params.uid);
        console.log("doc", doc);
        let recetasFav = [];
        for(var i=0; i<doc.Favoritos.length; i++){
            let recetaFav = await receta.getReceta(doc.Favoritos[i]);
            recetasFav.push(recetaFav);
            console.log(recetaFav);
            }
        res.json(recetasFav);
    });
    
    //ELIMINAR RECETA
    app.delete('/api/recetas/:_id', checkToken, async(req, res)=>{
        let doc = await receta.getReceta(req.params._id);
        console.log(doc);
        if(doc){
            try{
                let rec = await receta.deleteReceta(req.params._id);
                res.status(201).send(`Eliminado: ${rec}`);
            }catch(err){
                res.status(400).send({error: err});
            }
        }else{
            res.status(400).send({error: "Esta receta no existe"})
        }
    });
    
    function validarRec(req, res, next){
        console.log("en validarRec")
        let {Nombre, Porciones, Ingredientes, Cantidades, Pasos, Categoria} = req.body;
        if(Nombre && Porciones && Ingredientes && Cantidades && Pasos && Categoria){
            console.log("validarrec exitoso")
            next();
            return
        }else{
            console.log("validarRec error")
            let falta = ''
                if(Nombre){}else{falta += ' nombre'};
                if(Porciones){}else{falta += ' porciones'};
                if(Ingredientes){}else{falta += ' ingredientes'};
                if(Cantidades){}else{falta += ' cantidades'};
                if(Pasos){}else{falta += ' pasos'};
                if(Categoria){}else{falta += ' categoria'};
                console.log(falta)
                res.status(400).send({error: `Completa todos los campos requeridos, falta:  ${falta}`});
        } 
    }

app.listen(port, () =>
  console.log(`http://localhost:${port}`));
