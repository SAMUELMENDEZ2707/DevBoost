require('dotenv').config();
const express = require('express');
const path = require('path');
const auth = require('./authController');

const app = express();
app.use(express.json());

// servir archivos estáticos desde src/public
app.use(express.static(path.join(__dirname, '..', 'public')));

// rutas de autenticación
app.post('/api/register', auth.register);
app.post('/api/login', auth.login);

// ruta simple para verificar token (ejemplo)
app.get('/api/profile', auth.verifyToken, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor auth en http://localhost:${PORT}`);
});