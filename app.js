"use strict";
var express = require('express');
var path = require('path');
var https = require("https");
var fs = require("fs")
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require("passport");
var passportHTTP = require('passport-http');
var config = require("./config");

// Routes de la aplicación
var index = require('./routes/index');
var users = require('./routes/users');
var cursos = require('./routes/cursos');

// Ficheros de clave privada y certificado
var clavePrivada = fs.readFileSync(path.join(__dirname, config.private_key));
var certificado = fs.readFileSync(path.join(__dirname, config.certificate));
var app = express();

// Autentificación
app.use(passport.initialize()); // Autentificación

// Daos
var DAOUsuarios = require('./integration/DAOUsuarios');
var daoUsuarios = new DAOUsuarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// Routers
app.use('/users', users);
app.use('/cursos', cursos);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.end();
});

// Estrategia a seguir para la autenticación de un usuario
passport.use(new passportHTTP.BasicStrategy(
        {realm: 'Autenticacion'},
        function (correo, clave, callback) {
            // Llamamos al DAO para verificar la autenticación en la BD
            var datos = {correo : correo, clave : clave};
            daoUsuarios.verificarUsuario(datos,function (err, result) {
                if (result.length > 0) {
                    console.log("Autenticacion CORRECTA");
                    callback(null, {
                        userId: result[0].id_usuario
                    });
                } else {
                    console.log("Autenticacion INCORRECTA");
                    callback(null, false);
                }
            });

        }
));
// Creamos el servidor para escuchar por HTTPS
var servidor = https.createServer({
    key: clavePrivada,
    cert: certificado
},
        app);

// ------------------- Pone a la escucha el puerto HTTPS -------------------
servidor.listen(config.port, function (err) {
    if (err)
        console.log("Error: " + err.message);
    else
        console.log("Servidor escuchando en el puerto 5555");
});
