const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.put('/uploads/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningun archivo'
      }
    })
  }
  // valida tipo
  let tiposValidos = ['productos', 'usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
        tipo
      }
    })
  }

  let archivo = req.files.archivo
  let nombreSeparado = archivo.name.split('.');
  let extension = nombreSeparado[nombreSeparado.length - 1];
  console.log(nombreSeparado);

  // ========================================
  // Extensiones permitidas
  // ========================================
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  console.log("extension", extension)

  if (!extensionesValidas.includes(extension)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
        extension
      }
    })
  }

  // Cambiar nombre al archivo 
  let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`
  archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    // aqui la imagen esta subida
    switch (tipo) {
      case 'usuarios':
        imagenUsuario(id, res, nombreArchivo)
        break;

      case 'productos':
        imagenProducto(id, res, nombreArchivo)
        break;
    }

  });
})

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      })
    }

    borrarArchivo(usuarioDB.img, 'usuarios')

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })

  })
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      })
    }
    borrarArchivo(productoDB.img, 'productos')
    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado
      })
    })
  })
}

function borrarArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`)
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;