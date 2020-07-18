
function guardarReceta(){
    let Nombre = document.getElementById("platillo").value;
    let Porciones = document.getElementById("porcion").value;
    let Ingredientes = document.getElementById("ingredientes").value;
    let Cantidades = document.getElementById("cantidades").value;
    let Pasos = document.getElementById("pasos").value;
    let Categoria = document.getElementById('inputGroupSelect01').value;
    let Favoritos = document.getElementById('inputGroupSelect02').value;

    let newReceta = {Nombre, Porciones, Ingredientes, Cantidades, Pasos, Categoria, Favoritos}
    console.log(JSON.stringify(newReceta));

    let xhr = new XMLHttpRequest();
    xhr.open('POST',`/api/recetas`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(newReceta));
    xhr.onload = ()=>{
        if(xhr.status==201){
            console.log(xhr.response)
            let detalleRecetaId = JSON.parse(xhr.response);   
            console.log("detalle de receta: ",detalleRecetaId);
            $("#staticBackdrop").modal('show');

        }else{
            console.log("error")
        }
    }
}

function redireccionar(){
    window.location.href="../recetas/index.html"
}

/*
window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');  // $('img')[0]
            img.src=URL.createObjectURL(this.files[0]); // set src to blob url
            document.getElementById("urlImagen").value = URL.createObjectURL(this.files[0]);
            img.onload = imageIsLoaded;
        }
    })
  });
  
  function imageIsLoaded() { 
    alert(this.src);  // blob url
    // update width and height ...
  }*/