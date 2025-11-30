const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'samuel07',
  password: process.env.DB_PASS || 'sql',
  database: process.env.DB_NAME || 'devboost_db',
  waitForConnections: true,
  connectionLimit: 10
});

async function register(req, res) {
  const { nombre, apellido_paterno, apellido_materno, email, password, password_confirm } = req.body;
  if (!nombre || !apellido_paterno || !apellido_materno || !email || !password || !password_confirm) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (password !== password_confirm) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }
  try {
    const [exists] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (exists.length) return res.status(409).json({ error: 'Email ya registrado' });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, email, password_hash, rol, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nombre, apellido_paterno, apellido_materno, email, password_hash, 'estudiante']
    );
    return res.status(201).json({ id: result.insertId, message: 'Registro exitoso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email y password requeridos' });
  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, nombre, apellido_paterno, apellido_materno, email, password_hash, rol FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'error interno' });
  }
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

module.exports = { register, login, verifyToken };