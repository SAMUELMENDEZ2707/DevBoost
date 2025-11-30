https://github.com/SAMUELMENDEZ2707/DevBoost

Guía paso a paso para levantar servidor Node.js con MySQL en Windows
1. Instalar Node.js y npm
Descarga e instala Node.js desde https://nodejs.org (versión LTS recomendable).

Durante la instalación, selecciona la opción Add to PATH.

Finaliza la instalación y reinicia Visual Studio Code.

2. Verificar instalación de Node.js y npm
Abre una terminal nueva en VS Code.

Ejecuta:

text
node -v
npm -v
Debe mostrarte la versión de ambos. Si no aparecen, revisa tu instalación.

3. Inicializar el proyecto Node.js
Ubícate en la carpeta del proyecto (ejemplo: C:\Users\samue\OneDrive\Desktop\DevBoost).

Ejecuta:

text
npm init -y
Esto crea el archivo package.json.

4. Instalar dependencias necesarias
Ejecuta dentro de tu carpeta de proyecto:

text
npm install express mysql express-myconnection
Esto descargará las librerías necesarias para tu app y la conexión a MySQL.

Base de Datos DevBoost – Guía Paso a Paso
1. Crear la base de datos
text
CREATE DATABASE devboost_db;
USE devboost_db;
2. Crear las tablas
Tabla de categorías

text
CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(100) NOT NULL
);
Tabla de productos

text
CREATE TABLE productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre_producto VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2),
  id_categoria INT,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);
3. Insertar categorías
text
INSERT INTO categorias (nombre_categoria) VALUES
('Cursos de Programación Básica'),
('Programación Intermedia'),
('Avanzados y Especializados');
4. Insertar productos
text
INSERT INTO productos (nombre_producto, descripcion, precio, id_categoria) VALUES
('Introducción a la Programación', 'Aprende los fundamentos de la lógica y estructura de los programas.', 499.00, 1),
('Curso de Python desde Cero', 'Curso práctico para dominar los fundamentos de Python.', 799.00, 1),
('Lógica de Programación con JavaScript', 'Aprende estructuras lógicas usando JavaScript.', 699.00, 1),
('Fundamentos de HTML y CSS', 'Crea tus primeras páginas con HTML y CSS.', 599.00, 1),
('Git y Control de Versiones', 'Gestiona tu código con Git y GitHub.', 399.00, 1),
('Desarrollo Web con React', 'Aprende a construir interfaces modernas con React.', 999.00, 2),
('Programación Orientada a Objetos con Java', 'Comprende los principios OOP con Java.', 899.00, 2),
('Bases de Datos con MySQL', 'Crea, gestiona y consulta bases de datos relacionales.', 749.00, 2),
('APIs REST con Node.js', 'Desarrolla APIs escalables con Node y Express.', 849.00, 2),
('Desarrollo con PHP y Laravel', 'Crea proyectos web robustos con PHP y Laravel.', 899.00, 2),
('Inteligencia Artificial con Python', 'Domina las bases de la IA con librerías de Python.', 1199.00, 3),
('Blockchain para Desarrolladores', 'Aprende a crear aplicaciones basadas en Blockchain.', 1099.00, 3),
('Machine Learning aplicado', 'Crea modelos predictivos con Machine Learning.', 1299.00, 3),
('Desarrollo de Apps Móviles con Flutter', 'Crea aplicaciones multiplataforma con Flutter.', 999.00, 3),
('Seguridad Informática y Hacking Ético', 'Aprende sobre ciberseguridad y técnicas éticas.', 1299.00, 3);
5. Verificar datos
text
SELECT * FROM categorias;
SELECT * FROM productos;
6. Configurar conexión en Node.js
Archivo: app.js o db.js

text
import mysql from 'mysql2';

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // si no tienes contraseña
  database: 'devboost_db'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

export default conexion;
Si usas require:

text
const mysql = require('mysql2');
7. Ejecutar servidor
text
node app.js
Deberías ver en consola:

text
Conectado a la base de datos.
Servidor escuchando en el puerto 3000
8. Comprobación final desde consola o phpMyAdmin
text
USE devboost_db;
SHOW TABLES;
SELECT * FROM productos;

CREACION DE USUARIO
# Conectarse
mysql -u root -p

# Dentro del cliente mysql
USE mysql;
SELECT Host, User FROM user WHERE User = 'samuel07';


DROP USER 'samuel07'@'localhost';
FLUSH PRIVILEGES;

-- verificación
SELECT User, Host FROM mysql.user WHERE User = 'samuel07';

EXIT;

DEPENDENCIAS
npm install express mysql express-myconnection
