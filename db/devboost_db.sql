-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-10-2025 a las 17:38:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

DROP DATABASE IF EXISTS `devboost_db`;
CREATE DATABASE IF NOT EXISTS `devboost_db` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;
USE `devboost_db`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Tabla: categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: instructores
CREATE TABLE IF NOT EXISTS `instructores` (
  `id_instructor` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) UNIQUE,
  `bio` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_instructor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: productos (cursos)
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `nombre_producto` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(200) UNIQUE,
  `descripcion` TEXT,
  `precio` DECIMAL(10,2) DEFAULT 0.00,
  `id_categoria` INT NOT NULL,
  `id_instructor` INT DEFAULT NULL,
  `nivel` ENUM('Basico','Intermedio','Avanzado') DEFAULT 'Basico',
  `duracion_horas` DECIMAL(5,1) DEFAULT NULL,
  `activo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`),
  INDEX (`id_categoria`),
  INDEX (`id_instructor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: usuarios (alumnos/empleados)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(30) DEFAULT NULL,
  `rol` ENUM('admin','instructor','estudiante') DEFAULT 'estudiante',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: inscripciones (compras/matriculas)
CREATE TABLE IF NOT EXISTS `inscripciones` (
  `id_inscripcion` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `precio_pagado` DECIMAL(10,2) DEFAULT 0.00,
  `metodo_pago` VARCHAR(50) DEFAULT NULL,
  `estado` ENUM('pendiente','pagado','cancelado','completado') DEFAULT 'pendiente',
  `fecha_inscripcion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_finalizacion` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_inscripcion`),
  INDEX (`id_usuario`),
  INDEX (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: pagos
CREATE TABLE IF NOT EXISTS `pagos` (
  `id_pago` INT NOT NULL AUTO_INCREMENT,
  `id_inscripcion` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `metodo` VARCHAR(50),
  `estado` ENUM('pendiente','completado','fallido','reembolsado') DEFAULT 'completado',
  `fecha_pago` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`),
  INDEX (`id_inscripcion`),
  INDEX (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: reseñas
CREATE TABLE IF NOT EXISTS `reseñas` (
  `id_resena` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `comentario` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_resena`),
  INDEX (`id_usuario`),
  INDEX (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: tags y relación many-to-many producto_tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id_tag` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `producto_tags` (
  `id_producto` INT NOT NULL,
  `id_tag` INT NOT NULL,
  PRIMARY KEY (`id_producto`,`id_tag`),
  INDEX (`id_tag`),
  INDEX (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Relaciones FK
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_productos_instructor` FOREIGN KEY (`id_instructor`) REFERENCES `instructores` (`id_instructor`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_inscripciones_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_inscripcion` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones` (`id_inscripcion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pagos_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `reseñas`
  ADD CONSTRAINT `fk_resenas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_resenas_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `producto_tags`
  ADD CONSTRAINT `fk_producto_tags_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_producto_tags_tag` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Datos semilla: categorias
INSERT INTO `categorias` (`nombre_categoria`,`descripcion`) VALUES
('Cursos de Programación Básica','Cursos introductorios para quienes comienzan'),
('Programación Intermedia','Cursos para quien ya tiene bases y quiere profundizar'),
('Avanzados y Especializados','Cursos avanzados y especializados');

-- Datos semilla: instructores
INSERT INTO `instructores` (`nombre`,`email`,`bio`) VALUES
('Ana López','ana@devboost.com','Desarrolladora fullstack con 8 años de experiencia.'),
('Carlos Méndez','carlos@devboost.com','Ingeniero de datos y profesor de ML.'),
('Laura Torres','laura@devboost.com','Especialista en seguridad informática y redes.');

-- Datos semilla: productos (15 cursos)
INSERT INTO `productos` (`nombre_producto`,`slug`,`descripcion`,`precio`,`id_categoria`,`id_instructor`,`nivel`,`duracion_horas`) VALUES
('Introducción a la Programación','introduccion-programacion','Aprende los fundamentos de la lógica y estructura de los programas.',499.00,1,1,'Basico',20.0),
('Curso de Python desde Cero','python-desde-cero','Curso práctico para dominar los fundamentos de Python.',799.00,1,2,'Basico',30.0),
('Lógica de Programación con JavaScript','logica-js','Aprende estructuras lógicas usando JavaScript.',699.00,1,1,'Basico',25.0),
('Fundamentos de HTML y CSS','html-css','Crea tus primeras páginas con HTML y CSS.',599.00,1,1,'Basico',15.0),
('Git y Control de Versiones','git-control','Gestiona tu código con Git y Github.',399.00,1,1,'Basico',10.0),
('Desarrollo Web con React','react-web','Aprende a construir interfaces modernas con React.',999.00,2,1,'Intermedio',40.0),
('Programación Orientada a Objetos con Java','oop-java','Comprende los principios OOP con Java.',899.00,2,1,'Intermedio',35.0),
('Bases de Datos con MySQL','mysql-db','Crea, gestiona y consulta bases de datos relacionales.',749.00,2,2,'Intermedio',30.0),
('APIs REST con Node.js','apis-node','Desarrolla APIs escalables con Node y Express.',849.00,2,1,'Intermedio',28.0),
('Desarrollo con PHP y Laravel','php-laravel','Crea proyectos web robustos con PHP y Laravel.',899.00,2,1,'Intermedio',32.0),
('Inteligencia Artificial con Python','ia-python','Domina las bases de la IA con librerías de Python.',1199.00,3,2,'Avanzado',60.0),
('Blockchain para Desarrolladores','blockchain-dev','Aprende a crear aplicaciones basadas en Blockchain.',1099.00,3,3,'Avanzado',45.0),
('Machine Learning aplicado','ml-aplicado','Crea modelos predictivos con Machine Learning.',1299.00,3,2,'Avanzado',55.0),
('Desarrollo de Apps Móviles con Flutter','flutter-apps','Crea aplicaciones multiplataforma con Flutter.',999.00,3,1,'Intermedio',40.0),
('Seguridad Informática y Hacking Ético','seguridad-hacking','Aprende sobre ciberseguridad y técnicas éticas.',1299.00,3,3,'Avanzado',50.0);

-- Datos semilla: usuarios
INSERT INTO `usuarios` (`nombre`,`email`,`password_hash`,`telefono`,`rol`) VALUES
('Samuel','samuel@devboost.com','$2y$10$examplehash1','+34123456789','admin'),
('María Pérez','maria@ejemplo.com','$2y$10$examplehash2','+34111222333','estudiante'),
('José Ruiz','jose@ejemplo.com','$2y$10$examplehash3','+34999888777','estudiante');

-- Datos semilla: tags
INSERT INTO `tags` (`nombre`) VALUES
('python'),('web'),('seguridad'),('ai'),('blockchain'),('mobile'),('bases-de-datos');

-- Asociar tags a productos (ejemplos)
INSERT INTO `producto_tags` (`id_producto`,`id_tag`) VALUES
(2,1),(11,1),(13,1), -- python
(6,2),(4,2),(9,2),(14,6), -- web/mobile
(15,3),(15,2), -- seguridad
(12,5),(11,4),(13,4); -- blockchain/ai/ml

-- Inscripciones de ejemplo
INSERT INTO `inscripciones` (`id_usuario`,`id_producto`,`precio_pagado`,`metodo_pago`,`estado`) VALUES
(2,2,799.00,'tarjeta','pagado'),
(2,6,999.00,'paypal','pagado'),
(3,11,1199.00,'tarjeta','pendiente');

-- Pagos de ejemplo
INSERT INTO `pagos` (`id_inscripcion`,`id_usuario`,`monto`,`metodo`,`estado`) VALUES
(1,2,799.00,'tarjeta','completado'),
(2,2,999.00,'paypal','completado');

-- Reseñas de ejemplo
INSERT INTO `reseñas` (`id_usuario`,`id_producto`,`rating`,`comentario`) VALUES
(2,2,5,'Muy buen curso de Python, claro y práctico.'),
(2,6,4,'React explicado de forma concreta y con ejercicios.');

-- Ajustes finales
COMMIT;

-- Crear usuario de base de datos para desarrollo (opcional)
-- NOTA: cambiar contraseña en producción
CREATE USER IF NOT EXISTS 'samuel07'@'localhost' IDENTIFIED BY 'sql';
GRANT ALL PRIVILEGES ON `devboost_db`.* TO 'samuel07'@'localhost';
FLUSH PRIVILEGES;