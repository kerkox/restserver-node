const express = require('express');
const _ = require('underscore');

let {
  verificaToken,
  verificaAdmin_Role
} = require('../middlewares/autenticacion')

let app = express();

const Categoria = require('../models/categoria');

// ========================================
// Mostrar todas las categhorias
// ========================================
app.get('/categorias', verificaToken, (req, res) => {
  let from = req.query.from || 0;
  from = Number(from);

  let per_page = req.query.per_page || 5;
  per_page = Number(per_page);
  let filter = {
    deleted_at: null
  };
  Categoria.find(filter, "descripcion deleted_at usuario")
    .skip(from)
    .limit(per_page)
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      Categoria.count(filter, (err, conteo) => {
        res.json({
          ok: true,
          categorias,
          cuantos: conteo,
        });
      });
    });
});

// ========================================
// Mostrar una categhoria por ID
// ========================================
app.get('/categorias/:id', verificaToken, (req, res) => {
  Categoria.findById(req.params.id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(404).json({
        err: {
          message: "Categoria no encontrada"
        }
      })
    } else {
      return res.json({
        ok: true,
        categoria: categoriaDB
      })
    }
  })
});


// ========================================
// Crear una nueva categoria
// ========================================
app.post('/categorias', verificaToken, (req, res) => {
  // regresa la nueva categoria
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ========================================
// Actualizar una categoria
// ========================================
app.put('/categorias/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["descripcion", "usuario"]);

  Categoria.findByIdAndUpdate(
    id,
    body, {
      new: true,
      runValidators: true
    },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaDB) {
        return res.status(404).json({
          err: {
            message: "El ID de la Categoria no existe"
          }
        })
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

// ========================================
// Borrar una nueva categoria
// ========================================
app.delete('/categorias/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  // solo un administrador puede borrar categorias
  Categoria.findByIdAndRemove(req.params.id, (err, categoria) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(404).json({
        err: {
          message: "El ID de la Categoria no existe"
        }
      })
    }
    res.json({
      ok: true,
      message: 'Categoria borrada'
    })

  })
});



module.exports = app;