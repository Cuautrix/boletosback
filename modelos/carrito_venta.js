'use strict'
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var CarritoVentaSchema= Schema({
    admin:{type: Schema.ObjectId,ref:'admin',required:true},
   
});

module.exports = mongoose.model('CarritoVenta',CarritoVentaSchema);