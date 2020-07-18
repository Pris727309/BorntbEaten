const form = document.getElementById('userdata');
let user;

loadPerfilUser(huboCambios);

function loadPerfilUser(callback){
    console.log("loadPerfilUser");
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/user`);
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

document.getElementById('userdata').onsubmit = function(evt){
    evt.preventDefault();
    savePerfilUser()
}

function savePerfilUser(){
    let Nombre = document.getElementById("nombre").value;
    let Apellido = document.getElementById("apellido").value;
    let Contraseña = document.getElementById("inputPassword").value;

    let newUser={Nombre, Apellido, Contraseña};

    let xhr = new XMLHttpRequest();
    xhr.open('PUT',`/api/user`);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(newUser));
    xhr.onload = ()=>{
        if(xhr.status==200){
            user = JSON.parse(xhr.response);   
            console.log("Perfil User: ", user);
            window.location.href="../perfil/index.html"                                      
        }else{
            console.log("error")
        }
    }
}

var password = document.getElementById("inputPassword");
var confirmPassword = document.getElementById("confirmPassword");

function validarContraseña(){
    console.log("ValidarPWD")
    if(password.value != confirmPassword.value){
        confirmPassword.setCustomValidity("Passwords Don't Match");
    } 
    else if(password.value == '' || password.value == undefined || password.value == null){
        password.setCustomValidity("Passwords must not be empty");
    } else{
        form.classList.remove('was-validated');
        form.classList.add('was-validated');
        document.getElementById("guardarCambios").removeAttribute("disabled");

        confirmPassword.setCustomValidity('');
    }
}
password.onchange = validarContraseña;
confirmPassword.onkeyup = validarContraseña;

function huboCambios(){
    document.getElementById("nombre").value = user.Nombre;
    document.getElementById("apellido").value = user.Apellido;
}