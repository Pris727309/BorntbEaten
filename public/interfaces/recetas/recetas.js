let listaRecetas;

let page = 0;
let limit = 3;
let filtro;
let Ingrediente;
let Nombre;

function loadRecetas(page, limit, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/recetas?page=${page}&limit=${limit}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //console.log(xhr.response)
            listaRecetas = JSON.parse(xhr.response);   
            console.log(listaRecetas); 

            callback(page);                                              
        }else{
            console.log("error")
        }
    }
}

function limpiar(){
    filtro = '';
    Ingrediente = '';
    Nombre = '';
    loadRecetas(0,limit,paginacion);
}

function loadRecetasByCategoria(page, limit, categoria, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/recetas?Categoria=${categoria}&page=${page}&limit=${limit}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //console.log(xhr.response)
            listaRecetas = JSON.parse(xhr.response);   
            console.log(listaRecetas); 
            callback(page);                                              
        }else{
            console.log("error")
        }
    }
}

function getLigeros(){
    filtro = 'Ligeros'
    loadRecetasByCategoria(0,limit, filtro, paginacion)
}

function getAntojitos(){
    filtro = 'Antojitos'
    loadRecetasByCategoria(0,limit, filtro, paginacion)
}

function getFavoritos(){
    filtro = 'Favoritos'
    loadRecetasByFavoritos(0,limit,paginacion)
}

function loadRecetasByFavoritos(page, limit, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/recetas?Favoritos=true&page=${page}&limit=${limit}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //console.log(xhr.response)
            listaRecetas = JSON.parse(xhr.response);   
            console.log(listaRecetas); 
            callback(page);                                              
        }else{
            console.log("error")
        }
    }
}

function loadRecetasByNombre(page, limit, search, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/recetas?Nombre=${search}&page=${page}&limit=${limit}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //console.log(xhr.response)
            listaRecetas = JSON.parse(xhr.response);   
            console.log(listaRecetas); 
            callback(page);                                              
        }else{
            console.log("error")
        }
    }
}

function loadRecetasByIngrediente(page, limit, search, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/recetas?Ingredientes=${search}&page=${page}&limit=${limit}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            //console.log(xhr.response)
            listaRecetas = JSON.parse(xhr.response);   
            console.log(listaRecetas); 
            callback(page);                                              
        }else{
            console.log("error")
        }
    }
}

function getIngrediente(){
    Ingrediente = document.getElementById("search").value;
    loadRecetasByIngrediente(0,limit, Ingrediente, paginacion);
}

function getNombre(){
    Nombre = document.getElementById("search").value;
    loadRecetasByNombre(0,limit, Nombre, paginacion);
}

let activepage = 0;

function paginacion(pagina){
    console.log("pagina: ", pagina)
    console.log("listaRecetas: ", listaRecetas)
    activepage = pagina;
    
    if(pagina === 0 && listaRecetas.length < limit){
        console.log("pag0 y pocos elem");
        document.getElementById("prev0").classList.add('disabled');
        document.getElementById("prev").setAttribute('aria-disabled',true);
        document.getElementById("next0").classList.add('disabled');
        document.getElementById("next").setAttribute('aria-disabled',true);
        document.getElementById("1").classList.add('active');
        document.getElementById("2").classList.remove('active');
        document.getElementById("3").classList.remove('active');
    }else if(pagina === 0){
        console.log("pag0");
        document.getElementById("prev0").classList.add('disabled');
        document.getElementById("prev").setAttribute('aria-disabled',true);
        document.getElementById("next0").classList.remove('disabled');
        document.getElementById("next").setAttribute('aria-disabled',false);
        document.getElementById("2").classList.remove('active');
        document.getElementById("3").classList.remove('active');
        document.getElementById("1").classList.add('active');
    }else if(pagina > 0 && listaRecetas.length < limit){
        console.log("limite");
        document.getElementById("prev0").classList.remove('disabled');
        document.getElementById("prev").setAttribute('aria-disabled',false);
        document.getElementById("next0").classList.add('disabled');
        document.getElementById("next").setAttribute('aria-disabled',true);
    }else{
        console.log("default");
        document.getElementById("prev0").classList.remove('disabled');
        document.getElementById("prev").setAttribute('aria-disabled',false);
        document.getElementById("next0").classList.remove('disabled');
        document.getElementById("next").setAttribute('aria-disabled',false);
    }

    document.querySelector("#receta").innerHTML =  listaRecetas.map(u => 
        `<tr>
            <td>
                <img src="./${u.Imagen}" width="120" height="120">
            </td>
        <td>${u.Nombre}</td>
        <td columna="porcion">${u.Porciones}</td>
        <td>
            <p>${u.Ingredientes}</p>
        </td>
        <td>${u.Categoria}</td>
        <td><!-- Example single danger button -->
            <div class="btn-group">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Opciones
            </button>
            <div class="dropdown-menu">
                <a class="dropdown-item" onclick=detalleReceta("${u._id}") href= '../detallesReceta/index.html'>Detalles</a>
                <a class="dropdown-item" onclick=detalleReceta("${u._id}") href='../editReceta/index.html'>Editar</a>
                <a class="dropdown-item" onclick=modalEliminar("${u._id}") href="#" >Borrar</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Agregar a favoritos</a>
            </div>
            </div></td></tr>`).join('');
}

let idEliminar;

function modalEliminar(id){
    console.log(id);
    idEliminar = id;
    let recetaSeleccionada = listaRecetas.filter(receta=> receta._id == id);
    document.getElementById('nombrePlatillo').innerHTML = `<h5>${recetaSeleccionada[0].Nombre}</h5>`
    $("#modalEliminar").modal('show')
}

function eliminar(){
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE',`/api/recetas/${idEliminar}`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==201){ 
            $("#modalEliminar").modal('hide');
            if(filtro){
                loadRecetasByCategoria(activepage,limit,filtro,paginacion);   
            }else{
                loadRecetas(activepage,limit,paginacion); 
            }
               
        }else{
            console.log("error")
        }
    }
}

function detalleReceta(id){
    localStorage.setItem('_idReceta',id)
    console.log(localStorage.getItem('_idReceta'));

}

function previous(){
    console.log("activePage: ", activepage);
    if(activepage > 0){
        activepage -= 1;
        updatepagesPrev();
        if(filtro === 'Ligeros' || filtro === 'Antojitos'){
            loadRecetasByCategoria(activepage,limit,filtro,paginacion);   
        }else if(Ingrediente){
            loadRecetasByIngrediente(activepage,limit,search,paginacion);   
        }else if(Nombre){
            loadRecetasByNombre(activepage,limit,search,paginacion);   
        }else if(filtro === 'Favoritos'){
            loadRecetasByFavoritos(activepage,limit,paginacion); 
        }
        else{
            loadRecetas(activepage,limit,paginacion); 
        }
    }
}

function next(){
    console.log("activePage: ",activepage);
    activepage += 1;
    updatepagesNext();
    if(filtro === 'Ligeros' || filtro === 'Antojitos'){
        console.log(filtro);
        loadRecetasByCategoria(activepage,limit,filtro,paginacion);   
    }else if(Ingrediente){
        loadRecetasByIngrediente(activepage,limit,search,paginacion);   
    }else if(Nombre){
        loadRecetasByNombre(activepage,limit,search,paginacion);   
    }else if(filtro === 'Favoritos'){
        loadRecetasByFavoritos(activepage,limit,paginacion); 
    }else{
        loadRecetas(activepage,limit,paginacion); 
    }
}

function updatepagesNext(){
    if (activepage > 0){
        console.log("updatepagesNext");
        console.log("activePage: ",activepage);
        let oneButtonClassListActive = document.getElementById("1").classList.contains("active")
        let twoButtonClassListActive = document.getElementById("2").classList.contains("active")
        let threeButtonClassListActive = document.getElementById("3").classList.contains("active")
        console.log(oneButtonClassListActive)
        console.log(twoButtonClassListActive)
        console.log(threeButtonClassListActive)
        if (oneButtonClassListActive){
            console.log("ONE WAS ACTIVE")
            document.getElementById("1").classList.remove('active');
            document.getElementById("2").classList.add('active');
            document.getElementById("3").classList.remove('active');

        } 
        if (twoButtonClassListActive){
            console.log("TWO WAS ACTIVE")
            document.getElementById("1").classList.remove('active');
            document.getElementById("2").classList.remove('active');
            document.getElementById("3").classList.add('active');

        } 
        if (threeButtonClassListActive){
            console.log("THREE WAS ACTIVE")
            document.getElementById("1").classList.add('active');
            document.getElementById("2").classList.remove('active');
            document.getElementById("3").classList.remove('active');

            document.getElementById("01").innerHTML = activepage + 1;
            document.getElementById("02").innerHTML = activepage + 2;
            document.getElementById("03").innerHTML = activepage + 3;
        } 
        
    }
}

function updatepagesPrev(){
    if (activepage > 0){
        console.log("updatepagesPrev");
        console.log("activePage: ",activepage);
        let oneButtonClassListActive = document.getElementById("1").classList.contains("active")
        let twoButtonClassListActive = document.getElementById("2").classList.contains("active")
        let threeButtonClassListActive = document.getElementById("3").classList.contains("active")
        console.log(oneButtonClassListActive)
        console.log(twoButtonClassListActive)
        console.log(threeButtonClassListActive)
        if (oneButtonClassListActive){
            console.log("ONE WAS ACTIVE")
            document.getElementById("1").classList.remove('active');
            document.getElementById("2").classList.remove('active');
            document.getElementById("3").classList.add('active');

            document.getElementById("01").innerHTML = activepage - 1;
            document.getElementById("02").innerHTML = activepage ;
            document.getElementById("03").innerHTML = activepage + 1;
        } 
        if (twoButtonClassListActive){
            console.log("TWO WAS ACTIVE")
            document.getElementById("1").classList.add('active');
            document.getElementById("2").classList.remove('active');
            document.getElementById("3").classList.remove('active');
        } 
        if (threeButtonClassListActive){
            console.log("THREE WAS ACTIVE")
            document.getElementById("1").classList.remove('active');
            document.getElementById("2").classList.add('active');
            document.getElementById("3").classList.remove('active');
        } 
    }
}

loadRecetas(page,limit,paginacion);