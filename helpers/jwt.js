'use strict'

var jwt = require('jwt-simple');
var moment = require ('moment');
var secret = 'administrador';

exports.createToken = function(usuario){
    var payload ={
        sub: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        role:usuario.rol,
        alias:usuario.alias,
        iat: moment().unix(),
        exp: moment().add(7,'days').unix() //duarcion del token
    }
    return jwt.encode(payload,secret);
}