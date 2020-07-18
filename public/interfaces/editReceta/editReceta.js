let _idReceta = localStorage.getItem('_idReceta');
let token = localStorage.getItem('token');

function mostrarDetalle(_id, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/editReceta/${_id}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //
            console.log(xhr.response)
            detalleRecetaId = JSON.parse(xhr.response);   
            console.log("detalleRecetaId: ",detalleRecetaId);
            callback(detalleRecetaId[0]);                                              
        }else{
            console.log("error")
        }
    }
}

mostrarDetalle(_idReceta, detalleHTML);

function detalleHTML(obj){
    
    document.getElementById("platillo").value = obj.Nombre;
    document.getElementById("porcion").value = obj.Porciones;
    document.getElementById("ingredientes").value= obj.Ingredientes;
    document.getElementById("cantidades").value = obj.Cantidades;
    document.getElementById("pasos").value = obj.Pasos;
    //document.getElementById("categoria").placeholder = obj.Categoria;
    //falta favoritos
}

function cambiarDetalle(){
    
    let Nombre = document.getElementById("platillo").value;
    let Porciones = document.getElementById("porcion").value;
    let Ingredientes = document.getElementById("ingredientes").value;
    let Cantidades = document.getElementById("cantidades").value;
    let Pasos = document.getElementById("pasos").value;
    let Categoria = document.getElementById('inputGroupSelect01').value;
    let Favoritos = document.getElementById('inputGroupSelect02').value;

    let newReceta = {Nombre, Porciones, Ingredientes, Cantidades, Pasos, Categoria, Favoritos}

    let xhr = new XMLHttpRequest();
    xhr.open('PUT',`/api/editReceta/${_idReceta}`);
    xhr.setRequestHeader('Content-Type','application/json');
    console.log(JSON.stringify(newReceta));
    xhr.send(JSON.stringify(newReceta));
    xhr.onload = ()=>{
        if(xhr.status==200){
            console.log(xhr.response)
            detalleRecetaId = JSON.parse(xhr.response);   
            console.log(detalleRecetaId);
            $("#staticBackdrop2").modal('show');
        }else{
            console.log("error")
        }
    }
}

function backTo(){
    window.location.href = "../recetas/";
}