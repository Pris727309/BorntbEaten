let user;

document.getElementById('userdata').onsubmit = function(evt){
    evt.preventDefault();
    window.location.href="../editPerfil/index.html"
}

function loadPerfilUser(callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`http://localhost:3000/api/user`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = ()=>{
        if(xhr.status==200){
            user = JSON.parse(xhr.response);   
            console.log("Perfil User: ", user);
            callback();                                          
        }else{
            console.log("error")
        }
    }
}

loadPerfilUser(infoUser);

function infoUser(){
    console.log(document.getElementById("infoUser"));
    document.getElementById("infoUser").innerHTML =

    `<img class="mb-4 rounded-circle" src="https://randomuser.me/api/portraits/women/6.jpg" alt="" width="300" height="300">
      <label for="nombre" class="sr-only">Nombre</label>
      <input type="name" id="nombre" class="form-control" placeholder="Nombre: ${user.Nombre}" disabled>
      <label for="apellidos" class="sr-only">Apellidos</label>
      <input type="name" id="apellidos" class="form-control" placeholder="Apellido: ${user.Apellido}" disabled>
      <label for="inputEmail" class="sr-only">Dirección de correo</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Correo: ${user.Correo}" disabled>
      <label for="sexo" class="sr-only">Contraseña</label>
      <input type="name" id="sexo" class="form-control" placeholder="Sexo: ${user.Sexo}" disabled>
      <label for="Edad" class="sr-only">Confirmar contraseña</label>
      <input type="name" id="Edad" class="form-control" placeholder="Edad: ${user.Edad}" disabled>`
};