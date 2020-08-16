const express = require('express');
const {
  verificaToken
} = require('../middlewares/autenticacion');
let app = express();
const Producto = require('../models/producto')

// ========================================
// Obtener todos los productos
// ========================================
app.get('/productos', (req, res) => {
  // trae todos los productos 
  // populate: usuario categoria
  // paginado
})

// ========================================
// Obtener un producto por ID
// ========================================
app.get('/productos/:id', (req, res) => {
  // trae todos los productos 
  // populate: usuario categoria

})

// ========================================
// Crear un nuevo producto
// ========================================
app.post('/productos', (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado

})

// ========================================
// Actualizar un producto
// ========================================
app.put('/productos/:id', (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado

})


// ========================================
// Borrar un producto
// ========================================
app.delete('/productos/:id', (req, res) => {
  // cambiar el estado a disponible false
  // setear el valor de deleted_at

})



module.exports = app;