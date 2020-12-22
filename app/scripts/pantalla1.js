let ms = 5000;
let arraycuestionario = [];
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

//Ejecuta la función pasada como parámetro cuando se quité el foco en el elemento
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
  if (!patron.test(txt)) {
    msgError('parrafo_error');

    setTimeout(() => {
      inputEmail.select();
    }, 1);

    deleteError();
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

    //COMENTAR
    if (!Cookies.get(inputEmail.value)) {
      let cuestionario = {
        email: inputEmail.value,
        accesoFecha: fecha_format,
        accesoHora: hora_format,
        pregunta: [],
      };

      arraycuestionario.push(cuestionario);
      let str = JSON.stringify(cuestionario);
      Cookies.set(inputEmail.value, str, { expires: 7 });

      let user = {
        email: inputEmail.value,
      };

      let strUser = JSON.stringify(user);

      Cookies.set('usuarioActual', strUser, { expires: 1 });
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
