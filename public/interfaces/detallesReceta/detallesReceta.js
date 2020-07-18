let _idReceta = localStorage.getItem('_idReceta');

function mostrarDetalle(_id, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/detalleReceta/${_id}`);
    xhr.setRequestHeader('Content-Type','application/json');
    //xhr.setRequestHeader('x-auth', tokenUser)
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //
            console.log(xhr.response)
            detalleRecetaId = JSON.parse(xhr.response);   
            console.log(detalleRecetaId);
            callback(detalleRecetaId[0]);                                              
        }else{
            console.log("error")
        }
    }
}

mostrarDetalle(_idReceta, detalleHTML);

function detalleHTML(obj){

    document.getElementById("platillo").placeholder = obj.Nombre;
    document.getElementById("porcion").placeholder = obj.Porciones;
    document.getElementById("ingredientes").placeholder = obj.Ingredientes;
    document.getElementById("cantidades").placeholder = obj.Cantidades;
    document.getElementById("pasos").placeholder = obj.Pasos;
    document.getElementById("categoria").placeholder = obj.Categoria;
    //document.getElementById("favoritos").placeholder = obj.Favoritos;
}