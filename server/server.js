const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.get('/', function(req,res) {
  res.json('Hello World')
})

app.get('/usuario', function(req,res) {
  res.json('get Usuario')
})

app.post('/usuario', function(req,res) {
  res.json('Post Usuario')
})

app.put('/usuario/:id', function(req,res) {
  let id = req.params.id
  res.json({
    id
  })
})

app.delete('/usuario/:id', function(req,res) {
  let id = req.params.id
  res.json({
    id
  })
})

app.listen(3000, () => {
  console.log("Escuchando el puerto 3000");
})