var express = require('express');
var _ = require("underscore");
var moment = require("moment");
var router = express.Router();
var config = require("../config");
var DAOcursos = require('../integration/DAOCursos');
var daoCursos = new DAOcursos(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOHorarios = require('../integration/DAOHorarios');
var daoHorarios = new DAOHorarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOInscripciones = require('../integration/DAOInscripciones');
var daoInscripciones = new DAOInscripciones(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var passport = require("passport");
var passportHTTP = require('passport-http');
var tools = require("../helpers/tools.js");
// upload.single("foto")
var multer = require("multer");
var upload = multer({
    storage: multer.memoryStorage()
});
// Middleware para procesar ficheros

/**
 * Petición: /cursos/protegido
 * (se realiza antes de cualquier otra petición que requiera autenticación)
 */
router.get("/protegido",
        passport.authenticate('basic', {
            session: false
        }),
        function (req, res) {
            res.json({
                permitido: true
            });
        });
/**
 * Funcion que leer un curso por id_curso
 * Petición: /cursos/leer
 */
router.get('/leer', function (req, res, next) {
    console.log('<--- GET: /cursos/leer');
    var id_curso = Number(req.query.id_curso);
    if (!isNaN(id_curso)) { // si el 'id_curso' es un entero
        daoCursos.leerCursoPorId(id_curso, function (err, datos_curso) {
            if (err) {
                console.log("ERROR en DAO: no se ha podido leer por id");
                res.status(500);
                res.end;
            } else {
                daoHorarios.leerHorarioPorId_curso(id_curso, function (err, datos_horario) {
                    if (err) {
                        console.log("ERROR en DAO: no se ha podido leer el horario por id_curso");
                    } else {
                        res.status(200);
                        res.json({
                            datos_curso: datos_curso,
                            datos_horario: datos_horario
                        });
                    }
                });
            }
        });
    } else {
        res.status(404);
        res.end();
    }
});
/**
 * Petición: /cursos/crear
 */
router.post("/crear",
        function (req, res) {
            console.log('<--- POST: /cursos/crear');
            var nuevoCurso = req.body;
            // Comprobamos si ya existe un curso con ese título
            daoCursos.comprobarSiExiste(nuevoCurso, function (err, existe) {
                if (err) {
                    console.log("Error en DAO: no se ha podido insertar el curso");
                    res.status(500);
                    res.end();
                } else {
                    if (!existe) { // Si no existe, lo insertamos
                        daoCursos.crearCurso(nuevoCurso, function (err, result) {
                            if (err) {
                                console.log("Error en DAO: no se ha podido insertar el curso");
                                res.status(500);
                                res.end();
                            } else {
                                console.log("Aviso en DAO: curso insertado con éxito");
                                res.status(201);
                                res.end();
                            }
                        });
                    } else { // Si existe, mostramos un mensaje y devolvemos un estado 400 (Bad Request)
                        console.log("Error en DAO: ya existe un curso con ese título");
                        res.status(400);
                        res.end();
                    }
                }
            });
        });
/**
 * Petición: /cursos/actualizar
 */
router.put("/actualizar", function (req, res) {
    console.log('<--- PUT: /cursos/actualizar');
    var id_curso = Number(req.query.id_curso);
    if (!isNaN(id_curso)) { // si el id es un entero
        var nuevoCurso = req.body;
        // Modificamos en la BD
        daoCursos.modificarCurso(nuevoCurso, function (err, result) {
            if (err) {
                console.log("ERROR en DAO: no se ha podido modificar el curso");
                res.status(500);
                res.end();
            } else {
                console.log("AVISO en DAO: curso modificado con exito");
                res.status(200);
                res.end();
            }
        });
    } else {
        // Error 404 = Not Found
        res.status(404);
        res.end();
    }
});
/**
 * Petición: /cursos/eliminar
 */
router.delete("/eliminar", function (req, res) {
    console.log('<--- DELETE: /cursos/eliminar');
    var id_curso = Number(req.query.id_curso);
    if (!isNaN(id_curso)) { // si el id es un entero
        // Eliminamos el curso en la BD
        daoCursos.eliminarCurso(id_curso, function (err, result) {
            if (err) {
                console.log("ERROR en DAO: no se ha podido eliminar el curso");
                res.status(500);
                res.end();
            } else {
                console.log("AVISO en DAO: curso eliminado con exito");
                res.status(200);
                res.end();
            }
        });
    } else {
        // Error 404 = Not Found
        res.status(404);
        res.end();
    }
});
/**
 * Petición: /cursos/buscar
 */
router.get('/buscar', function (req, res, next) {
    console.log('<--- GET: /cursos/buscar');
    datos = {
        str: req.query.str,
        pos: Number(req.query.pos),
        num: Number(req.query.num)
    }
    if (datos.str !== '' && !isNaN(datos.pos) && !isNaN(datos.num)) { // si el id es un entero
        daoCursos.leerCursoPorTitulo(datos, function (err, datos_curso) {
            if (err) {
                console.log(err);
                console.log("ERROR en DAO: no se ha podido leer por titulo");
                res.status(500);
                res.end;
            } else {
                res.status(200);
                res.json(datos_curso);
            }
        });
    } else {
        // Error 404 = Not Found
        res.status(404);
        res.end();
    }
});
/**
 * Petición: /cursos/mostrar
 */
router.get('/mostrar', function (req, res, next) {
    console.log('<--- GET: /cursos/mostrar');
    daoCursos.leerCursoPorId(req.query.id_curso, function (err, datos_curso) {
        if (err) {
            console.log(err);
            console.log("ERROR en DAO: no se ha podido leer por titulo");
            res.status(500);
            res.end;
        } else {
            res.status(200);
            res.json(datos_curso);
        }
    });
});
/**
 * Petición: /cursos/miscursos
 */
router.get('/miscursos', function (req, res, next) {
    console.log('<--- GET: /cursos/miscursos');
    var id_usuario = Number(req.query.id_usuario);
    
    // Mirar en qué cursos está matriculado el alumno (tabla inscripciones)
    if (!isNaN(id_usuario)) { // Si es un 'id_usuario' válido
        daoCursos.getMisCursos(id_usuario, function (err, datos_curso) {
            if (err) {
                console.log(err);
                console.log("ERROR en DAO: no se ha podido leer por título");
                res.status(500);
                res.end;
            } else {
                var fecha_actual = new Date();
                // Particion organiza los cursos segun la propiedad p (fecha de inicio de un curso es posterior a la fecha actual)
                // Devuelve un array con 2 Arrays
                // El primer array contiene los elementos que cumplen la propiedad p, es decir, los Próximos cursos
                // El segundo array contiene los cursos restantes, es decir, los Cursos realizados y los actuales
                var array = _.partition(datos_curso, function (curso) {
                    return curso.fecha_inicio >= fecha_actual;
                });
                daoHorarios.leerHorarioDeUsuario(id_usuario, function (err, data_horario) {
                    if (err) {
                        console.log(err);
                        console.log("ERROR en DAO: no se ha podido leer el horario por id_curso");
                    } else {
                        var lunes = moment().startOf('isoweek').format('YYYY-MM-DD');
                        var fecha = {
                           lunes : moment().startOf('isoweek').format('YYYY-MM-DD'),
                           domingo : moment(lunes).add(6, 'days').format('YYYY-MM-DD')
                       };
                        console.log("Fecha<<<<<<<<<");
                        console.log(fecha);
                        console.log("Fecha<<<< DATOS CURSO<<<<<");
                        console.log(datos_curso);
                        console.log("Fecha<<<< DATOS HORARIO<<<<<");
                        console.log(data_horario);
                        var datos_horario =  tools.getHorario(datos_curso, data_horario, fecha);
                        res.status(200);
                            res.json({
                                proximos_cursos: array[0],
                                cursos_restantes: array[1],
                                datos_horario: datos_horario
                            });
                    }
                });
            }
        });
    } else { // Si no lo es
        res.status(404);
        res.end();
    }
});
router.get('/getHorario', function (req, res, next) {
    console.log('<--- GET: /cursos/getHorario');
    var id_usuario = Number(req.query.id_usuario);
    var fecha = req.query.fecha;
    console.log("ID USUARIO");
    console.log(id_usuario);
    // Mirar en qué cursos está matriculado el alumno (tabla inscripciones)
    if (!isNaN(id_usuario)) { // Si es un 'id_usuario' válido
        daoCursos.getMisCursos(id_usuario, function (err, datos_curso) {
            if (err) {
                console.log(err);
                console.log("ERROR en DAO: no se ha podido leer por título");
                res.status(500);
                res.end;
            } else {
                daoHorarios.leerHorarioDeUsuario(id_usuario, function (err, data_horario) {
                    if (err) {
                        console.log(err);
                        console.log("ERROR en DAO: no se ha podido leer el horario por id_curso");
                    } else {
                        
                        var datos_horario =  tools.getHorario(datos_curso, data_horario, fecha);
                        res.status(200);
                            res.json({
                                datos_horario: datos_horario
                            });
                    }
                });
            }
        });
    } else { // Si no lo es
        res.status(404);
        res.end();
    }
});
/**
 * Petición: /cursos/subirImagen
 */
router.put("/subirImagen/:id_curso", upload.single("imagen"), function (req, res) {
    console.log('<--- PUT: /subirImagen');
    var id_curso = Number(req.params.id_curso);
    
    if (!isNaN(id_curso)) {
        // Creamos un nuevo atributo llamado 'imagen' al objeto
        var imagen = req.file.buffer;
        var datos = {
            id_curso: id_curso,
            imagen: imagen
        };
        // Modificamos la imagen asociada a un curso
        daoCursos.modificarImagen(datos, function (err, result) {
            if (err) {
                console.log(err);
                console.log("ERROR en DAO: no se ha podido modificar la imagen");
                res.status(500);
                res.end;
            } else {
                var exito = false;
                if (result.affectedRows !== 0) {
                    exito = true;
                }
                res.status(200);
                res.json({
                    exito: exito
                });
            }
        });
    } else {
        res.status(404);
        res.end();
    }

});
/**
 * Petición: /cursos/obtenerImagen
 */
router.get("/obtenerImagen", function (req, res) {
    console.log('<--- GET: /obtenerImagen');
    var id_curso = Number(req.query.id_curso);
    if (!isNaN(id_curso)) {
        daoCursos.obtenerImagen(id_curso, function (err, result) {
            if (err) {
                console.log(err);
                console.log("ERROR en DAO: no se ha podido leer la imagen");
                res.status(500);
                res.end;
            } else {
                var imagen = result[0].imagen;
                res.status(200);
                res.end(imagen);
            }
        });
    } else {
        res.status(404);
        res.end();
    }
});
/**
 * Petición: /cursos/inscribirse
 */
router.post("/inscribirse",
        function (req, res) {
            console.log('<--- POST: /cursos/inscribirse');
            var datos = {id_usuario: req.body.id_usuario, id_curso: req.body.id_curso};
            // Comprobamos si el usuario esta inscrito en el curso
            daoInscripciones.comprobarInscripcion(datos, function (err, estaInscrito) {
                if (err) {
                    console.log("Error en DAO: no se ha podido comprobar si el usuario se esta inscrito en un curso");
                    res.status(500);
                    res.end();
                } else {
                    // si no esta inscrito en el curso lo guardamos
                    if (!estaInscrito) {
                        daoCursos.leerCursoPorId(datos.id_curso, function (err, datos_curso) {
                            if (err) {
                                console.log(err);
                                console.log("ERROR en DAO: no se ha podido leer por id");
                                res.status(500);
                                res.end;
                            } else {
                                // Comprobamos si quedan plazas por ocupar
                                if (datos_curso[0].plazas_disponibles > datos_curso[0].plazas_ocupadas) {
                                    daoCursos.incrementarPlazasOcupadas(datos.id_curso, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            console.log("ERROR en DAO: no se ha podido incrementar el numero de plazas ocupadas");
                                            res.status(500);
                                            res.end;
                                        } else {
                                            daoInscripciones.crearInscripcion(datos, function (err, result) {
                                                if (err) {
                                                    console.log("Error en DAO: no se ha podido inscribir en el curso");
                                                    res.status(500);
                                                    res.end();
                                                } else {
                                                    console.log("Aviso en DAO: usuario inscrito en el curso con éxito");
                                                    res.status(201);
                                                    res.end();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.status(404);
                                    res.end();
                                }
                            }
                        });

                    } else {
                        console.log("Aviso en DAO: el usuario ya esta inscrito en el curso");
                        res.status(409);
                        res.end();
                    }
                }
            });
        });

// Exportanción del router 'cursos'
module.exports = router;
