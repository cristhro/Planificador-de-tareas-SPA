"use strict";

var mysql = require("mysql");

/**
 * Inicialización del DAOHorarios
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {DAOHorarios}
 */
function DAOHorarios(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Crea un nuevo horario para un curso según su 'id_curso'
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOHorarios.prototype.crearHorario = function (datos, callback) {
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
          var sql = "INSERT INTO horarios(id_curso, dia_semana, hora_inicio, hora_fin) " +
                    "VALUES (?, ?, ?, ?)";
          var parametros = [datos.id_curso, datos.dia_semana, datos.hora_inicio, datos.hora_fin];
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
 * Lee los horarios de un curso segun el 'id_curso'
 * @param {type} id_curso
 * @param {type} callback
 * @returns {undefined}
 */
DAOHorarios.prototype.leerHorarioPorId_curso = function (id_curso, callback) {
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
          var sql = "SELECT * FROM horarios WHERE id_curso = ?";
          var parametros = [id_curso];
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
DAOHorarios.prototype.leerHorarioDeUsuario = function (id_usuario, callback) {
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
          
          var sql = "SELECT h.id_curso, h.dia_semana, h.hora_inicio, h.hora_fin " +
          "FROM horarios h join inscripciones i WHERE h.id_curso = i.id_curso and i.id_usuario = ?";
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
// Exportación del DAOHorarios
module.exports = DAOHorarios;




