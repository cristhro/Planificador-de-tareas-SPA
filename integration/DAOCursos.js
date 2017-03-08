"use strict";

var mysql = require("mysql");

/**
 * Inicialización del DAOCursos
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {DAOCursos}
 */
function DAOCursos(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inserta un nuevo curso
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.crearCurso = function (datos, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "INSERT INTO cursos(titulo, estado, descripcion, localidad, direccion, plazas_disponibles, plazas_ocupadas, fecha_inicio, fecha_fin) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
            var parametros = [datos.titulo, datos.estado, datos.descripcion, datos.localidad,
                datos.direccion, datos.plazas_disponibles, datos.plazas_ocupadas,
                datos.fecha_inicio, datos.fecha_fin];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Elimina un curso recibiendo el 'id_curso' por parámetro
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.eliminarCurso = function (id_curso, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "DELETE  FROM cursos WHERE id_curso = ?";
            var parametros = [id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Recibiendo el 'título' del curso, devuelve todos sus campos'
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.obtenerCursoPorTitulo = function (titulo, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "SELECT * FROM cursos WHERE titulo = ?";
            var parametros = [titulo];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Devuelve el curso completo con lo que pide en el enunciado de la practica
 * id_curso,titulo,descripcion,localidad,fecha_inicio,fecha_fin,plazas_disponibles
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.leerCursoPorId = function (id_curso, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "SELECT * FROM cursos WHERE id_curso = ?";
            var parametros = [id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Modifica el curso indicado en el 'id_curso'
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.modificarCurso = function (datos, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "UPDATE cursos SET titulo=?, estado=?, descripcion=?, localidad=?, direccion=?, plazas_disponibles=?, plazas_ocupadas=?, fecha_inicio=?, fecha_fin=? WHERE id_curso =?";
            var parametros = [datos.titulo, datos.estado, datos.descripcion, datos.localidad,
                datos.direccion, datos.plazas_disponibles, datos.plazas_ocupadas,
                datos.fecha_inicio, datos.fecha_fin, datos.id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Comprueba si existe un curso con un determinado título
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.comprobarSiExiste = function (datos, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, resultado) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "SELECT * FROM cursos WHERE titulo = ?"
            var parametros = [datos.titulo];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (result.length > 0) {
                                callback(null, true);
                            } else {
                                callback(null, false);
                            }
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Devuelve la imagen del curso según su 'id_curso'
 * @param {type} id_curso
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.obtenerImagen = function (id_curso, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "SELECT imagen FROM cursos WHERE id_curso = ?";
            var parametros = [id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Modifica la imagen de un curso según su 'id_curso'
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.modificarImagen = function (datos, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "UPDATE cursos SET imagen=? WHERE id_curso =?";
            var parametros = [datos.imagen, datos.id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
/**
 * Búsqueda por nombre de curso
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.leerCursoPorTitulo = function (datos, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
        callback(err, null);
        } else {
        //nombre,la localidad de impartición y las fechas de inicio y fin
        var sql = "SELECT id_curso,titulo, localidad, fecha_inicio, fecha_fin, plazas_disponibles, plazas_ocupadas " +
                "FROM cursos " +
                "WHERE LOWER(titulo) LIKE ? ORDER BY fecha_inicio ASC LIMIT ?,? ";
                var parametros = ["%" + datos.str + "%", datos.pos, datos.num];
        conexion.query(sql, parametros, function (err, results) {
            conexion.end();
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
        }
    });
};
/**
 * Busque de los cursos que pertenecen a un usuario, tablas usadas (usuarios y inscripciones)
 * @param {type} id_usuario
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.getMisCursos = function (id_usuario, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
        callback(err, null);
        } else {
        //nombre,la localidad de impartición y las fechas de inicio y fin
        var sql =   "SELECT c.id_curso, c.titulo, c.localidad, c.fecha_inicio, c.fecha_fin " +
                    " FROM " +
                    " cursos c JOIN inscripciones i" +
                    " WHERE i.id_usuario = ? AND i.id_curso = c.id_curso  ";
                
        conexion.query(sql, [id_usuario], function (err, results) {
            conexion.end();
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
        }
    });
};
/**
 * Funcion que  a partir de la 'id_curso' obtiene la imagen de ese curso
 * @param {type} id_curso
 * @param {type} callback
 * @returns {undefined}
 */
DAOCursos.prototype.obtenerImagen = function (id_curso, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "SELECT imagen FROM cursos WHERE id_curso = ?";
            var parametros = [id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
DAOCursos.prototype.incrementarPlazasOcupadas = function (id_curso, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "UPDATE cursos SET plazas_ocupadas = plazas_ocupadas + 1 WHERE id_curso =?";
            var parametros = [id_curso];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
// Exportación del DAO
module.exports = DAOCursos;



