"use strict";

// Variables globales de identificación
var correo = null;
var clave = null;
var id_usuario = null;
var id_curso = null;
var cadenaBase64 = btoa(correo + ":" + clave);
var fechas = {
    anterior:"",
    siguiente:""
};

/**
 * Función que es lanzada automáticamente cuando el documento ha sido cargado
 * @type type
 */
$(document).ready(function () {
    // Borramos todo el contenido del contenedor-principal
    $("#contenedor-principal > div").hide();
    // Esperamos 50 ms y volvemos a activar el contenedor-principal
    setTimeout(function () {
        $("#contenedor-principal").css("display", "inline");
        $("#contenedor-principal").css("padding", "40px");
    }, 50);
    // Mostramos la página de bienvenida
    bienvenida();

    /*------------------------------------------------------------*/
    /* -------- TODOS LOS EVENTOS 'CLICK' DE LA WEB ------------- */
    /*------------------------------------------------------------*/
    // Opción "Nuevo curso"
    $("#nav-nuevo-curso").on("click", function () {
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            $("#nuevo-curso").fadeIn(300);
        }, 500);
    });
    // Opción crear curso dentro de "Nuevo curso"
    $("#crear-curso").on("click", function () {
        crearCurso(cadenaBase64);
    });
//------------------------------------------------------------------------------
    // Opción "Buscar cursos"
    $("#nav-buscar-cursos").on("click", function () {
        // Borramos si hubiese algún resultado anterior
        $("#tabla_cursos tbody tr").remove();
        $("#tabla_cursos tbody p").remove();
        $("#paginacion").hide();
        $("#campoTexto").val("");
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            $("#buscar-cursos").fadeIn(300);
        }, 500);
    });
    // Opción buscar dentro de "Buscar cursos"
    $("#boton-buscar").on("click", function () {
        actualizarTablaCursos();
    });
//------------------------------------------------------------------------------
    // Opción "Mis cursos"
    $("#nav-mis-cursos").on("click", function () {
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            $("#mis-cursos").fadeIn(300);
        }, 2000);
        misCursos(id_usuario, cadenaBase64, function (fechaAModificar){
            fechas = fechaAModificar;
        });
    });
    // boton-Siguiente
    $("#boton-siguiente").on("click", function () {
        $("#horario").fadeOut(400);
        setTimeout(function () {
            actualizarTablaHorario(fechas.siguiente, id_usuario,function (fechaAModificar){
                fechas = fechaAModificar;
            });
            $("#horario").fadeIn(300);
        }, 2000);

    });
    // boton-Anterior
    $("#boton-anterior").on("click", function () {
        $("#horario").fadeOut(400);
        setTimeout(function () {
            actualizarTablaHorario(fechas.anterior, id_usuario,function (fechaAModificar){
                 fechas = fechaAModificar;
            });
            $("#horario").fadeIn(300);
        }, 2000);

    });
//------------------------------------------------------------------------------
    // Opción "Registro"
    $("#boton-registro").on("click", function () {
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            $("#registro").fadeIn(300);
        }, 500);
    });
    // Opción crear cuenta dentro de "Registro"
    $("#crear-cuenta").on("click", function () {
        crearUsuario();
    });
//------------------------------------------------------------------------------
    // Opción "Entrar"
    $("#nav-login").on("click", function () {
        mostrarPaginaLogin();
    });
    // Opción de 'Ir a login' desde el Modal de login
    $("#goLogin").on("click", function () {
        $("#ingreso-sistema")[0].reset();
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            $("#login").fadeIn(300);
        }, 500);
    });
    // Opción de 'Entrar' desde el login principal
    $("#boton-entrar").on("click", function () {
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
        }, 500);
        var correoAux, claveAux, id_usuarioAux, cadenaBase64Aux;
        // Invocamos a login con una funcion callBack que recogera los datos con las variables aux por parametro
        login(function callBack(correoAux, claveAux, id_usuarioAux, cadenaBase64Aux) {
            // luego modificamos las variables globales dentro de la funcion
            correo = correoAux;
            clave = claveAux;
            id_usuario = id_usuarioAux;
            cadenaBase64 = cadenaBase64Aux;
        });
    });
    // Opción 'Salir' de la navbar
    $("#nav-close").on("click", function () {
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            var correoAux, claveAux, id_usuarioAux, cadenaBase64Aux;
             // Invocamos a salir con una funcion callBack que recogera los datos con las variables aux por parametro
            salir(function callBack(correoAux, claveAux, id_usuarioAux, cadenaBase64Aux) {
                // luego modificamos las variables globales dentro de la funcion
                correo = correoAux;
                clave = claveAux;
                id_usuario = id_usuarioAux;
                cadenaBase64 = cadenaBase64Aux;
            });
            bienvenida();
        }, 500);
    });
//------------------------------------------------------------------------------
// Esta función sirve para mostrar cursos en la opción "Buscar cursos"
$('#tabla_cursos').on('click', 'tr', function () {
    // Obtenemos el id del <tr>, o sea, de la fila (que recordemos es su 'id_curso')
    var idFila = this.id;
    id_curso = idFila;
    mostrarCurso(idFila);
});
// Esta función sirve para inscribirse en un curso"
$("#boton-inscribirse").on("click", function () {
        inscribirse(id_usuario, id_curso, cadenaBase64);
        // Cuando se haga click en el botón 'Inscribirse', cierra el Modal
        var modal = document.getElementById('myModal');
        setTimeout(function () {
            modal.style.display = "none";
        }, 200);
    });
});

/*------------------------------------------------------------*/
/* ---------- FUNCIONES AUXILIARES GENERALES ---------------- */
/*------------------------------------------------------------*/
/**
 * Añade los elementos para la página de bienvenida global
 * @returns {undefined}
 */
function bienvenida() {
    $("#nav-close").hide();
    $("#boton-inscribirse").hide();
    $("#nav-nuevo-curso").hide();
    $("#nav-mis-cursos").hide();
    $("#nav-correo").hide();
    $("#msg-inscribirse").fadeIn(300);
    $("#nav-login").fadeIn();
    $("#bienvenida").fadeIn(300);
}
/**
 * Añade los elementos para la páginad e bienvenida del usuario
 * @returns {undefined}
 */
function bienvenidaUsuario() {
    $("#bienvenida-mensaje").text("Bienvenido a tu planificador de tareas " + correo);
    $("#bienvenida").fadeIn(300);
    $("#msg-inscribirse").hide();
    $("#boton-inscribirse").fadeIn(300);
}
/**
 * Añade los elementos para el mensaje 'Success'
 * @param {type} negrita
 * @param {type} msg
 * @returns {undefined}
 */
function mostrarMensajeSuccess(negrita, msg) {
    var negrita = $("#success-negrita").text(negrita);
    var mensaje = msg;
    $("#success").text("");
    $("#success").append(negrita);
    $("#success").append(mensaje).fadeIn(100).fadeOut(6000);
}
/**
 * Añade los elementos para el mensaje 'Aviso'
 * @param {type} negrita
 * @param {type} msg
 * @returns {undefined}
 */
function mostrarMensajeAviso(negrita, msg) {
    var negrita = $("#aviso-negrita").text(negrita);
    var mensaje = msg;
    $("#aviso").text("");
    $("#aviso").append(negrita);
    $("#aviso").append(mensaje).fadeIn(100).fadeOut(6000);
}
/**
 * Añade los elementos para el mensaje 'Error'
 * @param {type} negrita
 * @param {type} msg
 * @returns {undefined}
 */
function mostrarMensajeError(negrita, msg) {
    var negrita = $("#error-negrita").text(negrita);
    var mensaje = msg;
    $("#error").text("");
    $("#error").append(negrita);
    $("#error").append(mensaje).fadeIn(100).fadeOut(6000);
}
function mostrarModalLogin(){
    console.log("¡Acceso denegado!");
    var header = $(".modal-headerLogin");
    var body = $(".modal-bodyLogin");
    // Eliminamos el texto por si se vuelve a pulsar y sigue sin identificarse
    $(".modal-headerLogin h2").remove();
    $(".modal-bodyLogin h3").remove();
    $(".modal-bodyLogin p").remove();
    // Ponemos el mensaje de advertencia
    header.append("<h2>¡No estás identificado!</h2>");
    body.append("<h3>Lo siento, pero es necesario que te identifiques para poder continuar.</h3>");
    body.append("<p>Si no quieres hacerlo, puedes buscar los cursos disponibles en la pestaña 'Buscar cursos'.</p>");
    body.append("<p>Igualmente te animamos a participar para que, entre todos, sigamos mejorando.</p>");
    body.append("<p style='font-weight: bold'>¡Esperamos verte pronto!</p>");
    // Llevamos a cabo toda la lógica para que aparezca la ventana Modal
    var modal = document.getElementById('myModalLogin');
    // Cuando se haga click en el botón, abre el Modal
    modal.style.display = "block";
}
function mostrarPaginaLogin(){
    $("#ingreso-sistema")[0].reset();
        $("#contenedor-principal > div").fadeOut(400);
        setTimeout(function () {
            $("#login").fadeIn(300);
        }, 500);
}
