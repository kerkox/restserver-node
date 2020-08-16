const express = require('express');
const {
  verificaToken
} = require('../middlewares/autenticacion');
let app = express();
const Producto = require('../models/producto')

// ========================================
// Obtener todos los productos
// ========================================
app.get('/productos', verificaToken, (req, res) => {
  // trae todos los productos 
  // populate: usuario categoria
  // paginado
  let from = req.query.from || 0;
  from = Number(from);

  let per_page = req.query.per_page || 5;
  per_page = Number(per_page);
  let filter = {
    deleted_at: null,
  };
  Producto.find(filter)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .skip(from)
    .limit(per_page)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      Producto.count(filter, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          cuantos: conteo,
        });
      });
    });

})

// ========================================
// Obtener un producto por ID
// ========================================
app.get('/productos/:id', verificaToken, (req, res) => {
  // trae todos los productos 
  // populate: usuario categoria
  let id = req.params.id
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(404).json({
        err: {
          message: "El ID del producto no existe"
        }
      })
    }
    res.json({
      ok: true,
      producto: productoDB
    })

  })
})

// ========================================
// Crear un nuevo producto
// ========================================
app.post('/productos', verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado
  let body = req.body;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id,
  })

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      producto: productoDB

    })

  })
})

// ========================================
// Actualizar un producto
// ========================================
app.put('/productos/:id', verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado

})


// ========================================
// Borrar un producto
// ========================================
app.delete('/productos/:id', verificaToken, (req, res) => {
  // cambiar el estado a disponible false
  // setear el valor de deleted_at

})



module.exports = app;