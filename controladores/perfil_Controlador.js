
'use strict'
var Perfil = require ('../modelos/perfil');
var Boleto = require ('../modelos/boleto');
var bcrypt = require('bcrypt-nodejs');
var jwt = require ('../helpers/jwt');

var fs=require('fs');
var path=require('path');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var ejs = require('ejs');
const carrito_venta = require('../modelos/carrito_admin');
const venta = require('../modelos/venta');






exports.loginPerfil = async (req, res) => {
    try {
        // Almacenar el correo y contraseña
        var data = req.body;
        // Buscar correo
        var perfil_arreglo = [];
        perfil_arreglo = await Perfil.find({ matricula: data.matricula });
    
        if (perfil_arreglo.length == 0) {
            res.status(200).send({ message: 'No se encontro la matricula', data: undefined });
        } else {
            // LOGIN
            let usuario = perfil_arreglo[0];
            bcrypt.compare(data.password, usuario.password, async function (error, check) {
                if (check) {
                        res.status(200).send({
                            data: usuario,
                            token: jwt.createToken(usuario)
                        });
                
                } else {
                    res.status(200).send({ message: 'La contraseña no coincide', data: undefined });
                }
            });
        }
    } catch (error) {
        console.error('Error general:', error);
        res.status(500).send({ message: 'Error en el servidor', data: undefined });
    }
}
exports.obtener_admin_usuario = async  (req, res)=>{
  if(req.usuario){
      var id = req.params['id'];
      try{
          var reg = await Perfil.findById({_id:id});
           res.status(200).send({data:reg});
      }catch{
          res.status(200).send({data:undefined});
      }
  }else{
      res.status(500).send({message: 'Sin acceso'})
  }
}


exports.obtener_boletos_por_rango = async (req, res) => {
    try {
    
      const { numero } = req.params;
        console.log(req.params)
      const num = parseInt(numero);
        console.log(num)
      if (isNaN(num) || num < 1) {
        return res.status(400).send('Número inválido');
      }
  
      const start = (num - 1) * 500 + 1;
      const end = num * 500;
  
      const boletos = await Boleto.find({ numero: { $gte: start, $lte: end } });
      const boletosFormateados = boletos.map(boleto => ({
        _id: boleto._id,
        numero: boleto.numero,
        status: boleto.status
      }));
  

      res.status(200).send({data:boletosFormateados});
    } catch (err) {
      res.status(500).send('Error al obtener boletos por rango');
    }
  };

exports.registrar_boletos = async (req, res) => {
    try {
      const boletos = [];
  
      for (let i = 1; i <= 5000; i++) {
        boletos.push({ numero: i, status: 'disponible' });
      }
  
      await Boleto.insertMany(boletos);
  
      res.status(201).send('Boletos registrados exitosamente');
    } catch (err) {
      res.status(500).send('Error al registrar boletos');
    }
  };

  
  exports.comprar_boleto = async (req, res) => {
    if (req.usuario) {
      if (req.usuario.role === 'Gerente') {
        try {
          var id = req.params['id'];
          var id_Carrito = '65c3bb788c7aec54e82b83dc';
  
          // Obtener el boleto para obtener su número antes de actualizar el estado
          let boleto = await Boleto.findById(id);
  
          // Verificar si se encontró el boleto
          if (!boleto) {
            return res.status(404).send({ message: 'Boleto no encontrado' });
          }
  
          // Actualizar el estado del boleto a 'comprado'
          let reg = await Boleto.findByIdAndUpdate(id, { status: 'pendiente' }, { new: true });
          const data = {
           carrito_venta:id_Carrito,
           boleto:reg.id
        };
          if (reg) {
            let reg2 = await carrito_venta.create(
              data
            )
            // Actualizar el carrito de ventas agregando el id y número del boleto
            
  
            res.status(200).send({ data: reg });
          } else {
            res.status(404).send({ message: 'Boleto no encontrado' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Error en el servidor' });
        }
      } else {
        res.status(403).send({ message: 'Sin acceso' });
      }
    } else {
      res.status(403).send({ message: 'Sin acceso' });
    }
  };
  exports.quitar_boleto = async (req, res) => {
    if (req.usuario) {
      if (req.usuario.role === 'Gerente') {
        try {
          var id = req.params['id']; // ID del boleto a quitar
          var id_Carrito = '65c3bb788c7aec54e82b83dc'; // ID del carrito de ventas (puedes obtenerlo de req.body si se envía desde el cliente)
  
          // Obtener el boleto para obtener su número antes de actualizar el estado
          let boleto = await Boleto.findById(id);
  
          // Verificar si se encontró el boleto
          if (!boleto) {
            return res.status(404).send({ message: 'Boleto no encontrado' });
          }
  
          // Actualizar el estado del boleto a 'disponible'
          let reg = await Boleto.findByIdAndUpdate(id, { status: 'disponible' }, { new: true });
  
          // Eliminar el registro de carrito_venta donde se encuentre el boleto
          let deleted = await carrito_venta.findOneAndDelete({ carrito_venta: id_Carrito, boleto: id });
  
          if (reg && deleted) {
            res.status(200).send({ message: 'Boleto quitado exitosamente' });
          } else {
            res.status(404).send({ message: 'Boleto no encontrado en el carrito de ventas' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Error en el servidor' });
        }
      } else {
        res.status(403).send({ message: 'Sin acceso' });
      }
    } else {
      res.status(403).send({ message: 'Sin acceso' });
    }
  };
  
  
  

  exports.obtener_boletos_carrito = async (req, res) => {
    if(req.usuario){
      var id = req.params['id'];
      try{
          let reg = await carrito_venta.find().populate('boleto');
          console.log(reg)
           res.status(200).send({data:reg});
      }catch{
          res.status(200).send({data:undefined});
      }
  }else{
      res.status(500).send({message: 'Sin acceso'})
  }
  };

  exports.registrar_venta = async (req, res) => {
    if (req.usuario) {
      if (req.usuario.role === 'Gerente') {
        try {
          let data = req.body;
          let boletosIds = data.boletos.map(boleto => boleto._id); // Obtener array de IDs de boletos
  
          // Actualizar el estado de todos los boletos a 'comprado'
          await Boleto.updateMany(
            { _id: { $in: boletosIds } }, // Filtrar por los IDs de boletos en el arreglo
            { status: 'comprado' }
          );
  
          // Crear la venta en la colección 'venta'
          let reg2 = await venta.create(data);
  
          // Limpiar el carrito de ventas
          await carrito_venta.deleteMany({});
  
          res.status(200).send({ data: reg2 });
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Error en el servidor' });
        }
      } else {
        res.status(403).send({ message: 'Sin acceso' });
      }
    } else {
      res.status(403).send({ message: 'Sin acceso' });
    }
  };

  exports.obtener_total = async (req, res) => {
    try {
      const reg = await Boleto.countDocuments({ status: 'comprado' });
      const reg2 = await Boleto.countDocuments({ status: 'cancelado' });
  
      console.log(reg, reg2);
      res.status(200).send({ totalComprados: reg, totalCancelados: reg2 });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error en el servidor' });
    }
  };
  

  exports.obtener_ventas = async (req, res) => {
    try {
      const reg = await venta.find({});
      res.status(200).send({ data: reg });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error en el servidor' });
    }
  };



  exports.cancelar_boleto = async (req, res) => {
    if (req.usuario) {
      if (req.usuario.role === 'Gerente') {
        try {
          var id = req.params['id'];

  
          // Obtener el boleto para obtener su número antes de actualizar el estado
          let boleto = await Boleto.findOne({numero:id});

           // Actualizar el estado del boleto a 'comprado'
           let reg2 = await Boleto.findByIdAndUpdate(boleto._id, { status: 'cancelado' });
         
   
             res.status(200).send({ data: reg2 });
          // Verificar si se encontró el boleto
          
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Error en el servidor' });
        }
      } else {
        res.status(403).send({ message: 'Sin acceso' });
      }
    } else {
      res.status(403).send({ message: 'Sin acceso' });
    }
  };

  exports.filtro_encargado = async (req, res) => {
    if (req.usuario) {
        if (req.usuario.role === 'Gerente' || req.usuario.role === 'Propietario') {
            const nombre = req.query.nombre || ''; // Obtén el parámetro 'nombre' de la consulta
         

            // Filtra empleados por nombre y apellidos si se proporcionan
            let query = {};
            if (nombre !== '') {
                query.encargado = { $regex: nombre, $options: 'i' };
            }
          

            if (Object.keys(query).length === 0) {
                // Si no se proporcionaron nombre ni apellidos, obtén todos los empleados
                const reg = await venta.find();
                res.status(200).send({ data: reg });
            } else {
                const reg = await venta.find(query);
                res.status(200).send({ data: reg });
            }
        } else {
            res.status(500).send({ message: 'Sin acceso' });
        }
    } else {
        res.status(500).send({ message: 'Sin acceso' });
    }
};