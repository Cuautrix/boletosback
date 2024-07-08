'use strict'
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var CarritoAdminSchema= Schema({

    carrito_venta:{type:Schema.ObjectId,ref:'CarritoVenta',required:true},
    boleto:{type:Schema.ObjectId,ref:'boleto',required:true},

    fechaAgregado:{type:Date, default: Date.now()}

});

module.exports = mongoose.model('CarritoAdmin',CarritoAdminSchema);