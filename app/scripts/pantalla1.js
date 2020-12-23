let ms = 5000;

let formulario = document.getElementById('formulario');
let parrafo_error = document.createElement('p');
parrafo_error.setAttribute('id', 'parrafo_error');
parrafo_error.style.fontSize = '16px';

formulario.appendChild(parrafo_error);

/**
 * Cambia el texto del elemento almacenado en la variable,
 * además de eliminar un atributo a un elemento escondido en el documento HTML
 */
function mostrarUsuario() {
  let user = document.getElementById('txt');
  user.innerHTML = 'Usuario: ';

  let input = document.getElementById('txtUsuario');
  input.removeAttribute('hidden');
}

//Promesa que ejecuta la funcion mostrarUsuario si todo ha ido bien
let promesa = new Promise((resolv, reject) => {
  setTimeout(() => {
    resolv();
    clearTimeout;
  }, ms);
});

promesa.then(() => {
  mostrarUsuario();
});

//En caso que se pulsen las dos teclas indicadas el temporizador se parará y se ejecutará la función indicada
window.addEventListener('keyup', (teclaf10) => {
  if (teclaf10.ctrlKey == true && teclaf10.key == 'F11') {
    mostrarUsuario();
  }
});

//Patrón de email de tipo a@a.a
let patron = /^\s{0}.+@.+[.]{1}.+$/;
let inputEmail = document.getElementById('txtUsuario');

let pError = document.getElementById('parrafo_error');

//Ejecuta la función pasada como parámetro cuando se quite el foco en el elemento
inputEmail.addEventListener('focusout', comprobarEmail);

/**
 * Agregará un mensaje indicando una advertencia en el párrafo seleccionado en la variable indicada
 */
function msgError() {
  pError.innerHTML =
    '<strong style="color:red">Correo electrónico incorrecto</strong>';
}

/**
 * En caso de que el email no coincida con el del validador mostrará un mensaje,
 * en caso contrario redirigirá directamente a la segunda pantalla
 * @param {Event} event Recoge el contenido del elemento pasado en el Evento creado para la variable inputEmail
 */
function comprobarEmail(event) {
  let txt = event.target.value;

  //En caso que el texto pasado como parámetro no concuerde con el patron mostrará un mensaje de error y volverá a seleccionar el texto
  if (!patron.test(txt)) {
    msgError('parrafo_error');

    setTimeout(() => {
      inputEmail.select();
    }, 1);

    deleteError();

    //Si el texto es correcto almacenará la informacion en una cookie
  } else {
    const today = new Date();

    let fecha_format =
      today.getDate() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getFullYear();

    let hora_format =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    //Si no se encuentra la cookie indicada se crea una nueva
    if (!Cookies.get(inputEmail.value)) {
      let cuestionario = {
        email: inputEmail.value,
        accesoFecha: fecha_format,
        accesoHora: hora_format,
        pregunta: [],
      };

      //Convierte a cadena de texto el objeto pasado
      let str = JSON.stringify(cuestionario);

      //Almacena en la cookie el string agregando un tiempo de expiracion de 7 dias
      Cookies.set(inputEmail.value, str, { expires: 7 });

      //Nuevo objeto usuario
      let user = {
        email: inputEmail.value,
      };

      //Convierte el objeto en string
      let strUser = JSON.stringify(user);

      //Crea una nueva cookie y almacena el string, agregando tiempo de expiracion de 1 dia.
      //Con esta cookie podremos acceder a la cookie que queramos llamar para cargar sus preguntas
      Cookies.set('usuarioActual', strUser, { expires: 1 });

      //En caso contrario solo se crea o se modifica la cookie usuarioActual agregandole el email introducido por el usuario
    } else {
      let user = {
        email: inputEmail.value,
      };
      let strUser = JSON.stringify(user);
      Cookies.set('usuarioActual', strUser, { expires: 1 });
    }

    location.href = 'pantalla2.html';
  }
}

/**
 * Elimina el error generado al introducir un email incorrecto
 */
function deleteError() {
  setTimeout(() => {
    pError.innerHTML = '';
  }, 2000);
}
