/*------------------------------------------------------------*/
/* ------- FUNCIONES AUXILIARES PARA VISTA CURSO ------------ */
/*------------------------------------------------------------*/
/**
 * Realiza una búsqueda y muestra los cursos según 'str', 'pos' y 'num'
 * @returns {undefined}
 */
function actualizarTablaCursos() {
    // Antes de cargar una tabla, eliminamos lo que hubiese
    $("#tabla_cursos tbody tr").remove();
    $("#tabla_cursos tbody p").remove();
    $("#tabla_cursos tbody > h2, h3").remove();
    // Obtenemos el valor contenido en el cuadro de texto
    var texto = $("#campoTexto").val();
    // Cargamos los cursos del servidor
    $.ajax({
        type: "GET",
        url: "/cursos/buscar",
        data: {
            str: texto,
            pos: 0, // Para probar 
            num: 8 // Para probar
        },
        success: function (data, textStatus, jqXHR) {

            if (typeof data !== 'undefined' && data.length > 0) { // Si sí hay resultados

                var columna = $("<tr>");
                // Creamos las columnas de la tabla
                columna.append($("<th>").text("Nombre"));
                columna.append($("<th>").text("Lugar"));
                columna.append($("<th>").text("Inicio"));
                columna.append($("<th>").text("Fin"));
                columna.append($("<th>").text("Vacantes"));
                $("#tabla_cursos tbody").append(columna);

                // Recorremos cada uno de los cursos
                data.forEach(function (curso) {
                    var plazas_libres = curso.plazas_disponibles - curso.plazas_ocupadas;
                    var pintarRojo = false;
                    var pintarAmarillo = false;
                    var colorAmarillo = "rgba(231, 255, 6, 0.31)";
                    var colorRojo = "rgba(215, 9, 9, 0.26)";

                    // Si no hay plazas libres pintamos de color rojo
                    if (plazas_libres === 0) {
                        pintarRojo = true;
                    } else if (plazas_libres === 1) { // Si queda 1 plaza libre pintamos de color amarillo
                        pintarAmarillo = true;
                    }

                    // Para cada curso ponemos su id_curso
                    var fila = $("<tr id=" + curso.id_curso + ">");
                    // Y le añadimos el CSS para que se coloree al hacer hover
                    fila.css("transition", "all 1s ease");
                    fila.css("cursor", "#pointer");
                    fila.mouseenter(function () {
                        $(this).css("background", "#23c5e0");
                        $(this).css("cursor", "pointer");
                    });
                    fila.mouseleave(function () {
                        if (pintarRojo)
                            $(this).css("background", colorRojo);
                        else if (pintarAmarillo)
                            $(this).css("background", colorAmarillo);
                        else
                            $(this).css("background", "transparent");
                    });
                    // modificamos los colores de la fila
                    if (pintarRojo)
                        fila.css("background-color", colorRojo);
                    else if (pintarAmarillo)
                        fila.css("background-color", colorAmarillo);

                    fila.append($("<td>").text(curso.titulo));
                    fila.append($("<td>").text(curso.localidad));
                    fila.append($("<td>").text(cambiarFormatoFecha(curso.fecha_inicio)));
                    fila.append($("<td>").text(cambiarFormatoFecha(curso.fecha_fin)));
                    fila.append($("<td>").text(plazas_libres));

                    // Añadimos la fila al cuerpo de la tabla
                    $("#tabla_cursos tbody").append(fila);
                });
            } else { // Si no hay resultados al hacer la búsqueda
                $("#tabla_cursos tbody").append("<h2 style='text-align: center'>No hay resultados para mostrar :(</h2>");
                $("#tabla_cursos tbody").append("<h3 style='text-align: center; padding:10%'>Lo siento, he buscado <strong>'" + texto + "'</strong> y no he encontrado nada.<br><br>\n\
                                                Un equipo de monos altamente cualificados están trabajando para intentar solucionar la situación.</h3>");
            }
        }
    });
};
/**
 * Crea un nuevo curso. Para ello, primero realiza una petición para comprobar si el usuario
 * está autenticado y después, si lo está, realiza la petición para crear el curso
 * @param {type} cadenaBase64
 * @returns {undefined}
 */
function crearCurso(cadenaBase64) {
    // Petición para autenticar al usuario (se captura en cursos.js)
    $.ajax({
        method: "GET",
        url: "/cursos/protegido",
        beforeSend: function (req) {
            // En la cabecera de la petición enviamos la codificación de 'correo + clave'
            req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
        },
        success: function (data, state, jqXHR) {
            if (data.permitido) { // Si la autenticación es correcta
                console.log("¡Acceso permitido!");
                var formData = {
                    titulo: $("#titulo").val(),
                    estado: "espera",
                    descripcion: $("#descripcion").val(),
                    localidad: $("#localidad").val(),
                    direccion: $("#direccion").val(),
                    plazas_disponibles: $("#plazas_disponibles").val(),
                    plazas_ocupadas: 0,
                    fecha_inicio: $("#fecha_inicio").val(),
                    fecha_fin: $("#fecha_fin").val()
                };
                // Petición para crear el curso
                $.ajax({
                    type: "POST",
                    url: "/cursos/crear",
                    data: formData,
                    success: function (data, textStatus, jqXHR) {
                        // Borramos los datos que hubiese en el formulario
                        $("#form_nuevo_curso")[0].reset();
                        // Mostramos un mensaje de que todo ha ido bien
                        mostrarMensajeSuccess("Correcto:", " curso creado con exito");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 400) { // Si es un error del cliente (que el título ya existe, por ejemplo)
                            mostrarMensajeAviso("Atención:", " ya existe un curso con ese título");
                        } else { // Si es un error del servidor
                            mostrarMensajeError("Error:", " asegúrate de rellenar correctamente los campos");
                        }
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) { // Si no está autenticado
                mostrarModalLogin();
            } else { // Si ha sido un error referente a los datos
                // Mostramos un mensaje con el error
                mostrarMensajeError("Error:", " revisa que los datos sean correctos");
            }
        }
    });
}
;
/**
 * Función que hace una petición para obtener los datos de un curso según su título
 * @param {type} id_curso
 * @returns {undefined}
 */
function mostrarCurso(id_curso) {
    var datos = {
        id_curso: id_curso
    };
    $.ajax({
        type: "GET",
        url: "/cursos/leer",
        data: datos,
        success: function (data, textStatus, jqXHR) {
            if (typeof data.datos_curso !== 'undefined' && data.datos_curso.length > 0) { // Si hay resultados
                var datos_curso = data.datos_curso[0];
                var datos_horario = data.datos_horario;

                var plazas_libres = datos_curso.plazas_disponibles - datos_curso.plazas_ocupadas;
                var header = $(".modal-header");
                var body = $(".modal-body");
                // Eliminamos la información que tuviese la ventana Modal
                $(".modal-header > h2").text("");
                $(".modal-body > p").text("");
                $("#imagen").remove();
                // Rellenamos la información de la ventana Modal
                // Título
                header.append("<h2>" + datos_curso.titulo + "</h2>");
                // Imagen
                body.append('<div id="imagen" class="pull-right"><img src="/cursos/obtenerImagen?id_curso=' + id_curso + '"></div>');
                // Descripción
                body.append("<p>" + datos_curso.descripcion + "</p>");
                // Dirección
                body.append("<p style='font-weight: bold;'>Dirección</p>");
                body.append("<p>" + datos_curso.direccion + "</p>");
                // Localidad
                body.append("<p style='font-weight: bold;'>Localidad</p>");
                body.append("<p>" + datos_curso.localidad + "</p>");
                // Duración
                body.append("<p style='font-weight: bold;'>Duración</p>");
                body.append("<p>Desde el " + cambiarFormatoFecha(datos_curso.fecha_inicio) + " hasta el " + cambiarFormatoFecha(datos_curso.fecha_fin) + "</p>");
                // Horario
                body.append("<p style='font-weight: bold;'>Horario</p>");

                datos_horario.forEach(function (diaHorario) {
                    body.append("<p style='margin-left: 40px'>" + diaHorario.dia_semana + ": " + diaHorario.hora_inicio + "-" + diaHorario.hora_fin + "</p>");
                });

                // Número de plazas
                body.append("<p style='font-weight: bold;'>Número de plazas</p>");
                body.append("<p>" + datos_curso.plazas_disponibles + " (" + plazas_libres + " vacantes)</p>");

                // Llevamos a cabo toda la lógica para que aparezca la ventana Modal
                var modal = document.getElementById('myModal');
                // Coge el botón que abre el Modal
                var btn = document.getElementById(id_curso);
                // Coge el 'span' que cierra el Modal
                var span = document.getElementsByClassName("close")[0];
                // Cuando se haga click en el botón, abre el Modal 
                modal.style.display = "block";
                // Cuando se haga click en el span, cierra el Modal
                span.onclick = function () {
                    modal.style.display = "none";
                };
            } else { // Si no hay resultados (lo cual resulta imposible diría yo)
                // Mostramos un mensaje con el error
                mostrarMensajeError("Error:", " lo siento, no hay datos disponibles para ese curso");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Mostramos un mensaje con el error
            mostrarMensajeError("Error:", " lo siento, ocurrió algo inesperado al mostrar el curso");
        }
    });
}
;
/**
 * Función que dado un usuario devuelve sus cursos
 * @param {type} id_usuario
 * @param {type} cadenaBase64
 * @returns {undefined}
 */
function misCursos(id_usuario, cadenaBase64, callBack) {
    // Antes de cargar las tablas, eliminamos lo que hubiese
    $("#proximos_cursos tbody tr").remove();
    $("#proximos_cursos tbody p").remove();
    $("#cursos_realizados tbody tr").remove();
    $("#horario tbody p").remove();
    $("#horario tbody tr").remove();
    $("#cursos_realizados tbody p").remove();
    $("#horario tbody tr").remove();
    $("#horario tbody p").remove();
    $("#fecha-anterior").text("");
    $("#fecha-siguiente").text("");
    $("#fecha-actual").text("");
    // Petición para autenticar al usuario (se captura en cursos.js)
    console.log(id_usuario);
    $.ajax({
        method: "GET",
        url: "/cursos/protegido",
        beforeSend: function (req) {
            // En la cabecera de la petición enviamos la codificación de 'correo + clave'
            req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
        },
        success: function (data, state, jqXHR) {
            if (data.permitido) { // Si la autenticación es correcta
                console.log("¡Acceso permitido!");
                // Petición para recuperar los cursos de la BD
                $.ajax({
                    type: "GET",
                    url: "/cursos/miscursos",
                    data: {id_usuario: id_usuario},
                    success: function (data, textStatus, jqXHR) {
                        var arrayProximos = data.proximos_cursos;
                        var arrayRealizados = data.cursos_restantes;
                        var horario = data.datos_horario.horario;
                        var fechas = data.datos_horario.fechas;
                        
                        // --------> Tabla: Próximos cursos
                        if (typeof arrayProximos !== 'undefined' && arrayProximos.length > 0) { // Si sí hay resultados
                            // Completamos la tabla 'proximos-cursos'
                            var columnaProximos = $("<tr>");
                            columnaProximos.append($("<th>").text("Nombre"));
                            columnaProximos.append($("<th>").text("Lugar"));
                            columnaProximos.append($("<th>").text("Inicio"));
                            columnaProximos.append($("<th>").text("Fin"));
                            $("#proximos_cursos tbody").append(columnaProximos);
                            // Recorremos los próximos cursos
                            for (var i = 0; i < arrayProximos.length; i++) {
                                var fila = $("<tr>");
                                fila.append($("<td>").text(arrayProximos[i].titulo));
                                fila.append($("<td>").text(arrayProximos[i].localidad));
                                fila.append($("<td>").text(cambiarFormatoFecha(arrayProximos[i].fecha_inicio)));
                                fila.append($("<td>").text(cambiarFormatoFecha(arrayProximos[i].fecha_fin)));
                                $("#proximos_cursos tbody").append(fila);
                            }
                        } else { // Si no hay resultados al hacer la búsqueda
                            $("#proximos_cursos tbody").append("<p style='text-align: center; color: rgb(114, 0, 255);'>No tienes próximos cursos, ¡anímate e inscríbete en alguno!</p>");
                        }
                        // --------> Tabla: Cursos realizados
                        if (typeof arrayRealizados !== 'undefined' && arrayRealizados.length > 0) { // Si sí hay resultados
                            // Completamos la tabla 'cursos-realizados'
                            var columnaRealizados = $("<tr>");
                            columnaRealizados.append($("<th>").text("Nombre"));
                            columnaRealizados.append($("<th>").text("Lugar"));
                            columnaRealizados.append($("<th>").text("Inicio"));
                            columnaRealizados.append($("<th>").text("Fin"));
                            $("#cursos_realizados tbody").append(columnaRealizados);
                            for (var i = 0; i < arrayRealizados.length; i++) {
                                var fila = $("<tr>");
                                fila.append($("<td>").text(arrayRealizados[i].titulo));
                                fila.append($("<td>").text(arrayRealizados[i].localidad));
                                fila.append($("<td>").text(cambiarFormatoFecha(arrayRealizados[i].fecha_inicio)));
                                fila.append($("<td>").text(cambiarFormatoFecha(arrayRealizados[i].fecha_fin)));
                                $("#cursos_realizados tbody").append(fila);
                            }
                        } else { // Si no hay resultados al hacer la búsqueda
                            $("#cursos_realizados tbody").append("<p style='text-align: center; color: rgb(114, 0, 255);'>Aún no has realizado ningún curso</p>");
                        }
                        // --------> Tabla: Tu horario
                        
                        var columnaHorario = $("<tr>");
                        columnaHorario.append($("<th>").text("Hora"));
                        columnaHorario.append($("<th>").text("Lunes"));
                        columnaHorario.append($("<th>").text("Martes"));
                        columnaHorario.append($("<th>").text("Miercoles"));
                        columnaHorario.append($("<th>").text("Jueves"));
                        columnaHorario.append($("<th>").text("Viernes"));
                        columnaHorario.append($("<th>").text("Sabado"));
                        columnaHorario.append($("<th>").text("Domingo"));

                        $("#horario tbody").append(columnaHorario);
                        var dias = ["h","l", "m", "x", "j", "v", "s", "d"];
                        
                        var horasIntervalos = [
                            {ini: "00:00", fin: "11:00"}, // 0
                            {ini: "11:00", fin: "12:00"}, // 1
                            {ini: "11:00", fin: "18:00"}, // 2
                            {ini: "18:00", fin: "19:00"}, // 3
                            {ini: "18:00", fin: "20:00"}, // 4
                            {ini: "20:00", fin: "24:00"}  // 5
                        ];
                        var intervalos = [0, 1, 2, 3, 4, 5];
                        
                        // CREAMOS EL TABLERO DEL HORARIO CON ID (DIA+fila)  //  
                        intervalos.forEach(function (inter, fila) {
                            var columnaDia = $("<tr>");
                            dias.forEach(function (dia, col) {
                                // PINTAMOS LAS HORAS
                                if(col===0){
                                    var ini = horasIntervalos[fila].ini;
                                    var fin = horasIntervalos[fila].fin; 
                                    columnaDia.append($("<td id="+dia+fila+">").text(ini + "  "+ fin));
                                }else{
                                    columnaDia.append($("<td id="+dia+fila+">"));
                                }
                            });
                            $("#horario tbody").append(columnaDia);
                        });
                        
                        // MOSTRAMOS LAS FECHAS
                        $("#fecha-anterior").text(cambiarFormatoFecha(fechas.anterior.lunes) + "-"+cambiarFormatoFecha(fechas.anterior.domingo));
                        $("#fecha-siguiente").text(cambiarFormatoFecha(fechas.siguiente.lunes) + "-"+cambiarFormatoFecha(fechas.siguiente.domingo));
                        $("#fecha-actual").text(cambiarFormatoFecha(fechas.actual.lunes) + "-"+cambiarFormatoFecha(fechas.actual.domingo));
                        // ENVIAMOS LAS FECHAS A LA FUNCION QUE HA LLAMADO
                        callBack(fechas);
                        
                        // MODIFICAMOS LAS CELDAS
                        Object.keys(horario).forEach(function (dia) {
                            horario[dia].forEach(function (h) {
                                var id_curso = Math.floor(h/10);
                                var intervalo = h%10;
                                var celdaAModificar = "#"+getLetraDia(dia) + intervalo;
                                var tituloCurso ;
                                // OBTENEMOS EL NOMBRE DEL CURSO A PAERIR DEL ID_CURSO
                                $.ajax({
                                    type: "GET",
                                    url: "/cursos/mostrar",
                                    data: {id_curso : id_curso},
                                    success: function (data, textStatus, jqXHR) {
                                        tituloCurso = "<h7>"+data[0].titulo+"</h7>";
                                        var colorVerde = "rgba(180, 249, 191, 0.729412)";
                                        $(celdaAModificar).append(tituloCurso + "<br>").css("background-color", colorVerde);
                                    }
                                });
                              
                               
                            });
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // Mostramos un mensaje con el error
                        mostrarMensajeError("Error:", " lo siento, ocurrió algo inesperado al mostrar tus cursos");
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) { // Si no está autenticado
                mostrarModalLogin();
            } else { // Si ha sido un error referente a los datos
                // Mostramos un mensaje con el error
                mostrarMensajeError("Error:", " lo siento, ocurrió algo inesperado al autenticar tu usuario");
            }
        }
    });
}
;
/**
 * Inscribe a un usuario en un curso
 * @param {type} id_usuario
 * @param {type} id_curso
 * @param {type} cadenaBase64
 * @returns {undefined}
 */
function inscribirse(id_usuario, id_curso, cadenaBase64) {
    // Petición para autenticar al usuario (se captura en cursos.js)
    $.ajax({
        method: "GET",
        url: "/cursos/protegido",
        beforeSend: function (req) {
            // En la cabecera de la petición enviamos la codificación de 'correo + clave'
            req.setRequestHeader("Authorization", "Basic " + cadenaBase64);
        },
        success: function (data, state, jqXHR) {
            if (data.permitido) { // Si la autenticación es correcta
                console.log("¡Acceso permitido!");
                // Petición para recuperar los cursos de la BD
                $.ajax({
                    type: "POST",
                    url: "/cursos/inscribirse",
                    data: {id_usuario: id_usuario, id_curso: id_curso},
                    success: function (data, textStatus, jqXHR) {
                        mostrarMensajeSuccess("¡Perfecto!", " inscripción realizada con éxito ");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(jqXHR.status === 409){
                            // El usuario ya está inscrito
                            mostrarMensajeError("Aviso:", " ya estás inscrito en este curso");
                        }else{
                             // Mostramos un mensaje con el error
                            mostrarMensajeError("Error:", " lo siento, no hemos podido inscribirte en ese curso");
                        }
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) { // Si no está autenticado
                mostrarModalLogin();
            }else { // Si ha sido un error referente a los datos
                // Mostramos un mensaje con el error
                mostrarMensajeError("Error:", " lo siento, ocurrió algo inesperado al autenticar tu usuario");
            }
        }
    });
};

function actualizarTablaHorario(fecha, id_usuario ,callBack) {
    $("#horario tbody tr").remove();
    $("#horario tbody p").remove();
    $("#fecha-anterior").text("");
    $("#fecha-siguiente").text("");
    $("#fecha-actual").text("");
    $.ajax({
        type: "GET",
        url: "/cursos/getHorario",
        data: {id_usuario: id_usuario, fecha: fecha},
        success: function (data, textStatus, jqXHR) {
            console.log(data.datos_horario);
            var horario = data.datos_horario.horario;
            var fechas = data.datos_horario.fechas;

            // --------> Tabla: Tu horario
            var columnaHorario = $("<tr>");
            columnaHorario.append($("<th>").text("Hora"));
            columnaHorario.append($("<th>").text("Lunes"));
            columnaHorario.append($("<th>").text("Martes"));
            columnaHorario.append($("<th>").text("Miercoles"));
            columnaHorario.append($("<th>").text("Jueves"));
            columnaHorario.append($("<th>").text("Viernes"));
            columnaHorario.append($("<th>").text("Sabado"));
            columnaHorario.append($("<th>").text("Domingo"));

            $("#horario tbody").append(columnaHorario);
            var dias = ["h","l", "m", "x", "j", "v", "s", "d"];

            var horasIntervalos = [
                {ini: "00:00", fin: "11:00"}, // 0
                {ini: "11:00", fin: "12:00"}, // 1
                {ini: "11:00", fin: "18:00"}, // 2
                {ini: "18:00", fin: "19:00"}, // 3
                {ini: "18:00", fin: "20:00"}, // 4
                {ini: "20:00", fin: "24:00"}  // 5
            ];
            var intervalos = [0, 1, 2, 3, 4, 5];

            // CREAMOS EL TABLERO DEL HORARIO CON ID (DIA+fila)  //  
            intervalos.forEach(function (inter, fila) {
                var columnaDia = $("<tr>");
                dias.forEach(function (dia, col) {
                    // PINTAMOS LAS HORAS
                    if(col===0){
                        var ini = horasIntervalos[fila].ini;
                        var fin = horasIntervalos[fila].fin; 
                        columnaDia.append($("<td id="+dia+fila+">").text(ini + "  "+ fin));
                    }else{
                        columnaDia.append($("<td id="+dia+fila+">"));
                    }
                });
                $("#horario tbody").append(columnaDia);
            });
            // MOSTRAMOS LAS FECHAS
            $("#fecha-anterior").text(cambiarFormatoFecha(fechas.anterior.lunes) + "-"+cambiarFormatoFecha(fechas.anterior.domingo));
            $("#fecha-siguiente").text(cambiarFormatoFecha(fechas.siguiente.lunes) + "-"+cambiarFormatoFecha(fechas.siguiente.domingo));
            $("#fecha-actual").text(cambiarFormatoFecha(fechas.actual.lunes) + "-"+cambiarFormatoFecha(fechas.actual.domingo));
            
            // ENVIAMOS LAS FECHAS A LA FUNCION QUE HA LLAMADO
                callBack(fechas);
            // MODIFICAMOS LAS CELDAS
            Object.keys(horario).forEach(function (dia) {
                horario[dia].forEach(function (h) {
                    var id_curso = Math.floor(h/10);
                    var intervalo = h%10;
                    var celdaAModificar = "#"+getLetraDia(dia) + intervalo;
                    var tituloCurso ;
                    // OBTENEMOS EL NOMBRE DEL CURSO A PAERIR DEL ID_CURSO
                    $.ajax({
                        type: "GET",
                        url: "/cursos/mostrar",
                        data: {id_curso : id_curso},
                        success: function (data, textStatus, jqXHR) {
                            tituloCurso = "<h7>"+data[0].titulo+"</h7>";
                            var colorVerde = "rgba(180, 249, 191, 0.729412)";
                            $(celdaAModificar).append(tituloCurso + "<br>").css("background-color", colorVerde);
                        }
                    });
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Mostramos un mensaje con el error
            mostrarMensajeError("Error:", " lo siento, ocurrió algo inesperado al mostrar tus cursos");
        }
    });
};