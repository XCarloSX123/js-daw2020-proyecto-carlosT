/**
 * Muestra en el documento HTML el email introducido en la anterior pantalla junto
 * a la fecha de su último acceso
 */
function bienvenido() {
  let container = document.getElementById('container');

  //Creacion de elementos//

  let titulo = document.createElement('h2');

  let cuerpo = document.createElement('p');

  let boton = document.createElement('button');

  //Se obtiene la cookie y se almacena en variable

  let infoUsuario = JSON.parse(Cookies.get('usuarioActual'));

  let infoCookie = JSON.parse(Cookies.get(infoUsuario.email));

  //Agrega la informacion obtenida de la cookie

  titulo.textContent = `Hola ${infoCookie.email}`;

  cuerpo.textContent = `La última vez que entraste fue ${infoCookie.accesoFecha} a las ${infoCookie.accesoHora}`;

  boton.innerHTML = '<a href="pantalla3.html">Preguntas</a>';

  //Se agregan al fichero HTML los nodos

  container.appendChild(titulo);
  container.appendChild(cuerpo);
  container.appendChild(boton);
}

bienvenido();
