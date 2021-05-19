const form = document.getElementById('userdata');

document.getElementById('userdata').onsubmit = function(evt){
    evt.preventDefault();
    guardarUser()
}

function guardarUser(){
    let Nombre = document.getElementById("nombre").value;
    let Apellido = document.getElementById("apellidos").value;
    let Correo= document.getElementById("inputEmail").value;
    let Password = document.getElementById("inputPassword").value;

    let newUser = {Nombre, Apellido, Correo, Password}

    let xhr = new XMLHttpRequest();
    xhr.open('POST',`/api/usersv2`);
    xhr.setRequestHeader('Content-Type','application/json');
    //xhr.setRequestHeader('x-auth', token)
    console.log(JSON.stringify(newUser));
    xhr.send(JSON.stringify(newUser));
    xhr.onload = ()=>{
        if(xhr.status==201){
            console.log(xhr.response)
            detalleUsuarioId = JSON.parse(xhr.response);   
            console.log(detalleUsuarioId);
            window.location.href="/"
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
        document.getElementById("registrarBton").removeAttribute("disabled");

        confirmPassword.setCustomValidity('');
    }
}
password.onchange = validarContraseña;
confirmPassword.onkeyup = validarContraseña;

