'use strict'
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var PerfilSchema= Schema({
    nombres:{type: String,required:true},
    apellidos:{type: String, required:true},
    email:{ type: String, required: true},
    matricula:{ type: String, required: true}, 
    password:{ type: String, required: true}, 
    telefono:{ type: String, required: true},
    rfc:{ type: String, required: false},
    direccion: { type:String, required:false},
    rol:{ type: String, required: true},
    firma:{type:String,require:false},//firma del perfil
    foto_perfil:{type:String,required:false},
    fechaAgregado:{type:Date, default: Date.now()},
    activo: { type: String, default: 'Activo' },  // Campo añadido para marcar si el perfil está activo
    cajero:{type: Schema.ObjectId,ref:'caja',required:false},

});

module.exports = mongoose.model('perfil',PerfilSchema);