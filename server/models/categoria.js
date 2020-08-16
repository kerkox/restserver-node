const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, "La descripcion de la categoria es requerida"]
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  deleted_at: {
    type: Date,
    default: null
  }
})

module.exports = mongoose.model('Categoria', categoriaSchema);