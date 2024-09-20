//rutas para admin
const{Router}=require('express');
const express= require('express');
const router=Router();
var auth= require('../middlewares/authenticate')
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/firma'});


const perfilControlador=require('../controladores/perfil_Controlador.js');
const app = express();


router.post('/login_perfil',perfilControlador.loginPerfil);
router.get('/obtener_boletos_por_rango/:numero',perfilControlador.obtener_boletos_por_rango);
router.get('/obtener_boletos_busqueda/:numero',perfilControlador.obtener_boletos_busqueda);
router.get('/obtener_boletos_verificar/:numero',perfilControlador.obtener_boletos_verificar);

router.get('/obtener_boletos_carrito/:id',auth.auth,perfilControlador.obtener_boletos_carrito);
router.post('/registrar_boletos',perfilControlador.registrar_boletos);
router.post('/registrar_venta',auth.auth,perfilControlador.registrar_venta);
router.put('/comprar_boleto/:id',auth.auth,perfilControlador.comprar_boleto);
router.put('/quitar_boleto/:id',auth.auth,perfilControlador.quitar_boleto);
router.get('/obtener_total',auth.auth,perfilControlador.obtener_total);
router.get('/obtener_ventas',auth.auth,perfilControlador.obtener_ventas);

router.get('/obtener_boletos',auth.auth,perfilControlador.obtener_boletos);

router.get('/obtener_admin_usuario/:id',auth.auth,perfilControlador.obtener_admin_usuario);
router.get('/cancelar_boleto/:id',auth.auth,perfilControlador.cancelar_boleto);
router.post('/cancelar_boletos',auth.auth,perfilControlador.cancelar_boletos);


router.get('/filtro_encargado', auth.auth, perfilControlador.filtro_encargado);

module.exports=router;