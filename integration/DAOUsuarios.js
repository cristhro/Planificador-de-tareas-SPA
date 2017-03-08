"use strict";

var mysql = require("mysql");

/**
 * Inicialización del DAOUsuarios
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {nm$_DAOUsuarios.DAOUsuarios}
 */
function DAOUsuarios(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inserta un nuevo usuario
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.insertarUsuario = function (datos, callback) {
  if (callback === undefined) callback = function() {};
  // INICIALIZAR CONEXIÓN
  var conexion = mysql.createConnection({
      host: this.host,
      user: this.usuario,
      password: this.password,
      database: this.nombreBD
  });
    // REALIZAR CONEXIÓN
    conexion.connect(function(err) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "INSERT INTO usuarios(correo, clave, nombre, apellidos, sexo, fecha_nacimiento) " +
                "VALUES (?, ?, ?, ?, ?, ?)";
            var parametros = [datos.correo, datos.clave, datos.nombre, datos.apellidos, datos.sexo, datos.fecha_nacimiento];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                function(err, resultado) {
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
 * Comprueba si existe un usuario con un determinado 'correo' y 'clave'
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.verificarUsuario = function(datos, callback) {
    if (callback === undefined) callback = function() {};
      // INICIALIZAR CONEXIÓN
      var conexion = mysql.createConnection({
          host: this.host,
          user: this.usuario,
          password: this.password,
          database: this.nombreBD
      });
      // REALIZAR CONEXIÓN
      conexion.connect(function(err, resultado) {
          if (err) {
              callback(err, null);
          } else {
              var sql = "SELECT * FROM usuarios WHERE correo = ? AND clave = ?"
              var parametros = [datos.correo, datos.clave];
              // EJECUTAR CONSULTAS
              conexion.query(sql, parametros,
                  function(err, result) {
                      if (err) {
                          callback(err, null);
                      } else {
                          callback(null, result);
                      }
                      // CERRAR CONEXIÓN
                      conexion.end();
                  }
              );
          }
      });
};
/**
 * Comprueba si un determinado correo ya existe
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.comprobarSiExiste = function(datos, callback) {
    if (callback === undefined) callback = function() {};
      // INICIALIZAR CONEXIÓN
      var conexion = mysql.createConnection({
          host: this.host,
          user: this.usuario,
          password: this.password,
          database: this.nombreBD
      });
      // REALIZAR CONEXIÓN
      conexion.connect(function(err, resultado) {
          if (err) {
              callback(err, null);
          } else {
              var sql = "SELECT * FROM usuarios WHERE correo = ?";
              var parametros = [datos.correo];
              // EJECUTAR CONSULTAS
              conexion.query(sql, parametros,
                  function(err, result) {
                      if (err) {
                          callback(err, null);
                      } else {
                          if(result.length > 0){
                              resultado = {id_usuario: result[0].id_usuario};
                              callback(null, true);
                            }
                            else{
                              resultado = {id_usuario: null};;
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
 * Modifica un usuario según su 'id_usuario'
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.modificarUsuario = function(datos, callback) {
  if (callback === undefined) callback = function() {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "UPDATE usuarios SET clave=?, nombre_completo=?, sexo=? , foto=?, nacimiento=? WHERE id_usuario=? ";
            var parametros = [ datos.clave, datos.nombre_completo, datos.sexo, datos.foto, datos.nacimiento, datos.id_usuario];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                function(err, resultado) {
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
 * Devuelve los campos de un usuario según su 'id_usuario'
 * @param {type} id_usuario
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.leerUsuarioPorId = function(id_usuario, callback) {
        if (callback === undefined) callback = function() {};
        // INICIALIZAR CONEXIÓN
        var conexion = mysql.createConnection({
            host: this.host,
            user: this.usuario,
            password: this.password,
            database: this.nombreBD
        });
        // REALIZAR CONEXIÓN
        conexion.connect(function(err) {
            if (err) {
                callback(err,null);
            } else {
                var sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
                var parametros = [id_usuario];
                // EJECUTAR CONSULTAS
                conexion.query(sql, parametros,
                    function(err, resultado) {
                      if (err) {
                          callback(err,null);
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
 * Elimina a un usuario según su 'id_usuario'
 * @param {type} id_usuario
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.eliminarUsuarioPorId = function(id_usuario, callback) {
        if (callback === undefined) callback = function() {};
        // INICIALIZAR CONEXIÓN
        var conexion = mysql.createConnection({
            host: this.host,
            user: this.usuario,
            password: this.password,
            database: this.nombreBD
        });
        // REALIZAR CONEXIÓN
        conexion.connect(function(err) {
            if (err) {
                callback(err,null);
            } else {
                var sql = "DELETE FROM usuarios WHERE  id_usuario = ?";
                var parametros = [id_usuario];
                // EJECUTAR CONSULTAS
                conexion.query(sql, parametros,
                    function(err, resultado) {
                      if (err) {
                          callback(err,null);
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
 * Recibiendo el 'nombre' del curso, devuelve su 'id_usuario'
 * @param {type} nombre
 * @param {type} callback
 * @returns {undefined}
 */
DAOUsuarios.prototype.obtenerIdPorNombre = function (nombre, callback) {
  if (callback === undefined) callback = function() {};
  // INICIALIZAR CONEXIÓN
  var conexion = mysql.createConnection({
      host: this.host,
      user: this.usuario,
      password: this.password,
      database: this.nombreBD
  });
  // REALIZAR CONEXIÓN
  conexion.connect(function(err, result) {
      if (err) {
          callback(err, null);
      } else {
          var sql = "SELECT id_usuario FROM usuarios WHERE nombre = ?";
          var parametros = [nombre];
          // EJECUTAR CONSULTAS
          conexion.query(sql, parametros,
              function(err, resultado) {
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
// Exportación del DAOUsuarios
module.exports = DAOUsuarios;
