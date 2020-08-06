const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const { verificaToken } = require("../middlewares/autenticacion");

const app = express();

app.get("/usuario", verificaToken, function (req, res) {
  
  let from = req.query.from || 0;
  from = Number(from);

  let per_page = req.query.per_page || 5;
  per_page = Number(per_page);
  let filter = { deleted_at: null };
  Usuario.find(filter, "nombre email role estado google img deleted_at")
    .skip(from)
    .limit(per_page)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.count(filter, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

app.post("/usuario", verificaToken,function (req, res) {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id",verificaToken, function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete("/usuario/:id",verificaToken, function (req, res) {
  let id = req.params.id;

  let _delete = { estado: false, deleted_at: new Date() };
  Usuario.findByIdAndUpdate(id, _delete, { new: true }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

module.exports = app;
