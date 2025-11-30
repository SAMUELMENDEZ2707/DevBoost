const express = require('express');
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de conexión a MySQL
app.use(myConnection(mysql, {
    host: 'localhost', 
    user: 'samuel07', 
    password: 'sql', 
    port: 3306, 
    database: 'devboost_db'
}, 'pool'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Importar rutas
const apiRoutes = require('./src/routes/api');
const viewRoutes = require('./src/routes/views');

// Usar rutas
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/login.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 DevBoost API está lista para usar`);
});