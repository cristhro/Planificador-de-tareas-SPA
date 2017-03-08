"use strict";

var mysql = require("mysql");

/**
 * Inicialización del DAOInscripcion
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {DAOHorarios}
 */
function DAOInscripciones(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inscribe a un usuario en un curso
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOInscripciones.prototype.crearInscripcion = function (datos, callback) {
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
          var sql = "INSERT INTO inscripciones(id_usuario, id_curso) " +
                    "VALUES (?, ?)";
          var parametros = [datos.id_usuario, datos.id_curso];
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
 * Devuelve los cursos en los que está inscrito un usuario según su 'id_usuario'
 * @param {type} id_usuario
 * @param {type} callback
 * @returns {undefined}
 */
DAOInscripciones.prototype.obtenerCursosDeUsuario = function (id_usuario, callback) {
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
          var sql = "SELECT id_curso FROM inscripciones WHERE id_usuario = ?";
          var parametros = [id_usuario];
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
 * Funcion booleana que comprueba si un usuario esta inscrito en un curso
 * @param {type} id_usuario
 * @param {type} id_curso
 * @param {type} callback
 * @returns {undefined}
 */
DAOInscripciones.prototype.comprobarInscripcion = function (datos, callback) {
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
          var sql = "SELECT id_usuario FROM inscripciones WHERE id_usuario = ? and id_curso = ?";
          var parametros = [datos.id_usuario, datos.id_curso];
          // EJECUTAR CONSULTAS
          conexion.query(sql, parametros,
              function(err, resultado) {
                  if (err) {
                      callback(err, null);
                  } else {
                      if(resultado.length > 0){
                          callback(null, true);
                      }else{
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
// Exportación del DAOInscripciones
module.exports = DAOInscripciones;




