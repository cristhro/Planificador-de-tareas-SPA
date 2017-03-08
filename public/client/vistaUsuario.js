/*------------------------------------------------------------*/
/* ------ FUNCIONES AUXILIARES PARA VISTA USUARIO ----------- */
/*------------------------------------------------------------*/
/**
 * Crea un nuevo usuario
 * @returns {undefined}
 */
function crearUsuario(){
    // Recogemos los datos de los campos del formulario
    var formData = {
            correo: $("#email").val(),
            clave: $("#pass").val(),
            nombre: $("#name").val(),
            apellidos: $("#apellidos").val(),
            sexo: "M",
            fecha_nacimiento: $("#nacimiento").val()
        };
    $.ajax({
        type: "POST",
        url: "/users/crear",
        data: formData,
        success: function (data, textStatus, jqXHR) {
            // Borramos los datos que hubiese en el formulario
            $("#form_registro")[0].reset();
            // Mostramos un mensaje de que todo ha ido bien
            mostrarMensajeSuccess ("Correcto:", " te has registrado con éxito");
            mostrarPaginaLogin();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status === 400){ // Si es un error del cliente (que el correo ya existe, por ejemplo)
                mostrarMensajeAviso("Atención:", " ya existe un usuario con ese correo");
            }else{ // Si es un error del servidor
                // Mostramos un mensaje con el error
                mostrarMensajeError("Error:", " asegúrate de rellenar correctamente los campos");
            }
        }
    });
}
/**
 * Función para identificarse en la aplicación
 * @param {type} correo
 * @param {type} clave
 * @param {type} id_usuario
 * @returns {undefined}
 */
function login(callBack){
    // Recogemos los datos de los campos del formulario
    var correo = $("#login_email").val();
    var clave = $("#login_pass").val();
    
    $.ajax({
        type: "GET",
        url: "/users/login",
        data: {correo: correo, clave: clave},
        beforeSend: function(req) {
           req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
        },
        success: function (data, textStatus, jqXHR) {
            // Mostramos un mensaje de que todo ha ido bien
            var id_usuario = data.id_usuario; // devuelve 'data.id_usuario'
            var cadenaBase64 = btoa(correo + ":" + clave);
            
            // Modificamos los componentes de la vista
            $("#nav-correo").text(correo);
            $("#nav-close").fadeIn();
            $("#nav-correo").fadeIn();
            $("#nav-nuevo-curso").fadeIn(300);
            $("#nav-mis-cursos").fadeIn(300);
            $("#nav-login").hide();
            
            // Si todo ha ido bien enviamos los datos a la función que invocó Login
            callBack(correo,  clave , id_usuario, cadenaBase64); 
            mostrarMensajeSuccess ("Correcto:", " te has logueado con éxito");
            bienvenidaUsuario();
        },
        error: function (jqXHR, textStatus, errorThrown) {
             // Mostramos un mensaje con el error
            mostrarMensajeError("Error:", " El correo y/o la contraseña son incorrectos");
            mostrarPaginaLogin();
        }
    });
}
/**
 * Función que moddifica los valores de las variables globales de la aplicacion a ""
 * @param {type} callBack
 * @returns {undefined}
 */
function salir(callBack) {
    var correo = "";
    var clave = "";
    var id_usuario = "";
    var cadenaBase64 = btoa(correo + ":" + clave);
    callBack(correo, clave, id_usuario, cadenaBase64);
}