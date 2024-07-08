'use strict'
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var BoletoSchema= Schema({
    numero:{type: Number,required:true},
    status:{type: String, required:true},
  

});

module.exports = mongoose.model('boleto',BoletoSchema);