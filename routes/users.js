var express = require('express');
var router = express.Router();
var config = require("../config");
var passport = require("passport");
var passportHTTP = require('passport-http');
var DAOUsuarios = require('../integration/DAOUsuarios');
var daoUsuarios = new DAOUsuarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);

/**
 * Petición: /users/crear
 */
router.post("/crear", 
    function(req, res) {
        console.log('<--- POST: /users/crear');
        var nuevoUsuario = req.body;
            console.log(nuevoUsuario);
        // Validamos los campos    
        if(nuevoUsuario.correo ==="" || nuevoUsuario.correo ==="" || nuevoUsuario.apellidos ===""||nuevoUsuario.nombre ==="" ||nuevoUsuario.sexo ===""  ){
            console.log("Error en la validacion: campos faltan por rellenar");
            res.status(401);
            res.end();
        }else{
        // Comprobamos que el usuario no exista
        daoUsuarios.comprobarSiExiste(nuevoUsuario, function(err, existe){
            if(err){
                console.log(err);
                console.log("Error en DAO: no se ha podido insertar el usuario");
                res.status(500);
                res.end(); 
            }else{
                if(!existe){ // Si no existe, lo insertamos
                    daoUsuarios.insertarUsuario(nuevoUsuario, function (err, result) {
                        if(err){
                            console.log(err);
                            console.log("Error en DAO: no se ha podido insertar el usuario");
                            res.status(500);
                            res.end();
                        }
                        else{
                            console.log("Aviso en DAO: usuario insertado con éxito");
                            res.status(201);
                            res.end();
                        }
                    });  
                }else{ // Si existe, mostramos un mensaje y devolvemos un estado 400 (Bad Request)
                    console.log("Error en DAO: ya existe un usuario con ese correo");
                    res.status(400);
                    res.end();  
                }
            }
        });
    }
});
/**
 * Petición: /users/login
 */
router.get("/login", 
    function(req, res) {
        console.log('<--- GET: /users/login');
        var datos = {
            correo : req.query.correo, 
            clave : req.query.clave
        };
        daoUsuarios.verificarUsuario(datos,function (err, result) {
            if (result.length > 0) {
                console.log("Identificación CORRECTA");
                res.status(200);
                res.json( {
                    id_usuario: result[0].id_usuario
                });
            } else {
                console.log("Identificación INCORRECTA");
                res.status(400);
                res.end();
            }
        });
});

// Exportación del router 'users'
module.exports = router;
