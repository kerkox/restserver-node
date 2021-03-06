// Puerto
process.env.PORT = process.env.PORT || 3000

// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================
// Vencimiento del Token
// ========================
process.env.CADUCIDAD_TOKERN = '48h';


// ========================
// SEED de autenticación
// ========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-develop'

// ========================
// Base de datos
// ========================
let urlDB;

if (process.env.NODE_ENV == 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe'
} else {
  urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB


// ========================
// Google Client ID
// ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '792275556301-o3r53cvf15re27q3ej1bc0il5269toed.apps.googleusercontent.com'