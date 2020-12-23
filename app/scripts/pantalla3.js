let ms = 5000;
let preguntas = [];
let txtPregunta = document.getElementById('pregunta');
let txtPuntuacion = document.getElementById('puntuacion');
let contenedor = document.getElementById('contenedor');
let tabla = document.getElementById('tablaRespuestas');
let boton = document.getElementById('grabar');
boton.setAttribute('disabled', 'true');
let atras = document.getElementById('atras');
let infoUsuario = JSON.parse(Cookies.get('usuarioActual'));

//Eventos

boton.addEventListener('click', almacenarDatos);

atras.addEventListener('click', volveratras);

window.addEventListener('load', mostrarTabla(ms));

/**
 * Función que redirige a la página anterior a la actual
 */
function volveratras() {
  location.href = 'pantalla2.html';
}

/**
 * Genera una nueva tabla con los títulos para cada columna, si existen preguntas las carga también y las agrega al fichero html
 * @param {integer} ms Tiempo en ms pasado como parámetro para los temporizadores
 */
function mostrarTabla(ms) {
  // Promesa para generar la tabla de forma asíncrona

  let load = new Promise((resolver, rechazar) => {
    let cargar = document.createElement('p');

    cargar.textContent = 'Cargando respuestas...';

    contenedor.appendChild(cargar);

    //Le pasa a la funcion resolver la cookie en modo string

    if (ms >= 5000) {
      setTimeout(() => {
        contenedor.removeChild(cargar);
        let infocookie = JSON.parse(Cookies.get(infoUsuario.email));
        resolver(infocookie);
      }, ms);
    } else {
      contenedor.removeChild(cargar);
      let infocookie = JSON.parse(Cookies.get(infoUsuario.email));
      resolver(infocookie);
    }

    //Elimina el evento de carga para evitar generar una nueva tabla cada vez

    window.removeEventListener('load', mostrarTabla);
  });

  load.then((infocookie) => {
    //Se desactiva el boton hasta que cargue la tabla de preguntas

    boton.disabled = false;

    //Creación de los elementos para la cabecera de la tabla

    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');

    //Se agrega texto en los nodos

    td1.textContent = 'Título';
    td2.textContent = 'Respuesta';
    td3.textContent = 'Puntuación';
    td4.textContent = 'Estado';

    //Agrega los nodos a la tabla

    tabla.appendChild(tr);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    //Agrega una nueva fila por cada pregunta encontrada en la cookie

    for (let i = 0; i < infocookie.pregunta.length; i++) {
      let trnew = document.createElement('tr');

      let td1new = document.createElement('td');
      let td2new = document.createElement('td');
      let td3new = document.createElement('td');
      let td4new = document.createElement('td');

      td1new.textContent = infocookie.pregunta[i].titulo;
      td2new.textContent = infocookie.pregunta[i].respuesta;
      td3new.textContent = infocookie.pregunta[i].puntuacion;
      td4new.textContent = infocookie.pregunta[i].estado;

      //Agrega los nodos a la tabla

      trnew.appendChild(td1new);
      trnew.appendChild(td2new);
      trnew.appendChild(td3new);
      trnew.appendChild(td4new);

      tabla.appendChild(trnew);
    }
  });
}

/**
 * Cambia el estado en el que se encuentra la pregunta agregada. Guardando - OK {returns}
 * @param returns Nueva promesa para cambiar el estado de la pregunta agregada para agregarla a la cookie
 */
function temp() {
  return new Promise(function (resolver, rechazar) {
    setTimeout(() => {
      resolver();
    }, ms);

    setTimeout(() => {
      rechazar();
    }, ms * 2);
  });
}

/**
 * Funcion asincrona que agrega a la tabla los datos introducidos en el formulario. Tras pasar 5 segundos agrega dichos datos a la cookie.
 * En caso de ningun error el estado de la pregunta almacenada es OK. Si hay algun error se plasmará en el estado con Error al Guardar
 */
async function almacenarDatos() {
  try {
    //Se obtiene la cookie secundaria para poder obtener el nombre de la cookie que queremos cargar

    let infoUsuario = JSON.parse(Cookies.get('usuarioActual'));

    atras.disabled = true;

    //Creación de las celdas para cada fila de preguntas

    let fila = document.createElement('tr');
    let coltitulo = document.createElement('td');
    let colrespuesta = document.createElement('td');
    let colpuntuacion = document.createElement('td');
    let colestado = document.createElement('td');
    colestado.setAttribute('class', 'estadoTD');

    let txtRespuestavalor = document.querySelector(
      'input[name = "respuesta"]:checked'
    ).value;

    //Lanzará un error en caso que haya algún campo vacío

    if (
      txtPregunta.value === '' ||
      txtPuntuacion.value === '' ||
      txtRespuestavalor === ''
    ) {
      throw new Error();
    }

    coltitulo.textContent = txtPregunta.value;
    colrespuesta.textContent = txtRespuestavalor;
    colpuntuacion.textContent = txtPuntuacion.value;

    //Agregar elementos al fichero HTML

    fila.appendChild(coltitulo);
    fila.appendChild(colrespuesta);
    fila.appendChild(colpuntuacion);
    colestado.textContent = 'Guardando...';
    fila.appendChild(colestado);

    tabla.appendChild(fila);

    let cookietitulo = txtPregunta.value;
    let cookierespuesta = txtRespuestavalor;
    let cookiepuntuacion = txtPuntuacion.value;

    //Nuevo objeto con los datos de la cookie a agregar

    let cuestionario_pregunta = {
      titulo: cookietitulo,
      respuesta: cookierespuesta,
      puntuacion: cookiepuntuacion,
      estado: 'OK',
    };

    //Resetea el valor de los campos input

    document.getElementById('formulario').reset();

    let promesa = temp(ms);

    //Tras un retraso de 5 segundos agrega los datos a la cookie y el estado de la pregunta se actualiza a OK
    //Permite crear varias preguntas al mismo tiempo y agregarlas pasados 5 segundos
    await promesa
      .then(() => {
        let infoCookie = JSON.parse(Cookies.get(infoUsuario.email));

        //Agrega el contenido de la variable en el array pregunta que contiene la cookie
        infoCookie.pregunta.push(cuestionario_pregunta);

        let str = JSON.stringify(infoCookie);

        Cookies.set(infoUsuario.email, str, { expires: 7 });

        colestado.textContent = 'OK';
      })

      //En caso de error el estado de la pregunta se actualiza
      .catch(() => {
        colestado.textContent = 'Error al guardar';
      });

    //Devuelve el error generado anteriormente y lo mantiene en pantalla durante 1 segundo
  } catch (Error) {
    let container = document.getElementById('container');
    let error = document.createElement('p');

    error.style.color = 'red';
    error.textContent = 'Debe completar todos los campos';

    container.appendChild(error);

    setTimeout(() => {
      container.removeChild(error);
    }, 1000);
  }

  //Cuando todas las promesas han finalizado se comprueba si la ultima celda hija contiene el estado OK para volver a habilitar el boton de atras

  let ultimoTD = document.querySelector('tr:last-child .estadoTD:last-child');

  if (ultimoTD.textContent === 'OK') atras.disabled = false;
}
