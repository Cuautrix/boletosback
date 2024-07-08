const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ventaSchema = new mongoose.Schema({
    
    boletos: [{
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'boleto', required: true },
      numero: { type: Number, required: true },
    }],
  total: { type: Number, required: true},
  encargado: { type: String, required: true},
  hora: { type: String },
  fechaAgregado: { type: Date }
  
});

ventaSchema.pre('save', function (next) {
  const now = new Date();
  this.hora = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  this.fechaAgregado = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  next();
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;