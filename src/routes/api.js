const express = require('express');
const router = express.Router();

// Importar controladores
const categoriasController = require('../controllers/categoriasController');
const instructoresController = require('../controllers/instructoresController');
const productosController = require('../controllers/productosController');
const usuariosController = require('../controllers/usuariosController');
const inscripcionesController = require('../controllers/inscripcionesController');
const pagosController = require('../controllers/pagosController');
const resenasController = require('../controllers/resenasController');
const tagsController = require('../controllers/tagsController');

// ==================== RUTAS DE CATEGORÍAS ====================
router.get('/categorias', categoriasController.listarCategorias);
router.get('/categorias/:id', categoriasController.obtenerCategoria);
router.post('/categorias', categoriasController.crearCategoria);
router.put('/categorias/:id', categoriasController.actualizarCategoria);
router.delete('/categorias/:id', categoriasController.eliminarCategoria);

// ==================== RUTAS DE INSTRUCTORES ====================
router.get('/instructores', instructoresController.listarInstructores);
router.get('/instructores/:id', instructoresController.obtenerInstructor);
router.get('/instructores/:id/cursos', instructoresController.obtenerCursosInstructor);
router.post('/instructores', instructoresController.crearInstructor);
router.put('/instructores/:id', instructoresController.actualizarInstructor);
router.delete('/instructores/:id', instructoresController.eliminarInstructor);

// ==================== RUTAS DE PRODUCTOS ====================
router.get('/productos', productosController.listarProductos);
router.get('/productos/:id', productosController.obtenerProducto);
router.get('/productos/categoria/:id_categoria', productosController.obtenerProductosPorCategoria);
router.post('/productos', productosController.crearProducto);
router.put('/productos/:id', productosController.actualizarProducto);
router.delete('/productos/:id', productosController.eliminarProducto);

// ==================== RUTAS DE USUARIOS ====================
router.get('/usuarios', usuariosController.listarUsuarios);
router.get('/usuarios/:id', usuariosController.obtenerUsuario);
router.get('/usuarios/rol/:rol', usuariosController.obtenerUsuariosPorRol);
router.post('/usuarios', usuariosController.crearUsuario);
router.put('/usuarios/:id', usuariosController.actualizarUsuario);
router.delete('/usuarios/:id', usuariosController.eliminarUsuario);

// ==================== RUTAS DE INSCRIPCIONES ====================
router.get('/inscripciones', inscripcionesController.listarInscripciones);
router.get('/inscripciones/:id', inscripcionesController.obtenerInscripcion);
router.get('/inscripciones/usuario/:id_usuario', inscripcionesController.obtenerInscripcionesPorUsuario);
router.get('/inscripciones/producto/:id_producto', inscripcionesController.obtenerInscripcionesPorProducto);
router.post('/inscripciones', inscripcionesController.crearInscripcion);
router.put('/inscripciones/:id', inscripcionesController.actualizarInscripcion);
router.delete('/inscripciones/:id', inscripcionesController.eliminarInscripcion);

// ==================== RUTAS DE PAGOS ====================
router.get('/pagos', pagosController.listarPagos);
router.get('/pagos/:id', pagosController.obtenerPago);
router.get('/pagos/usuario/:id_usuario', pagosController.obtenerPagosPorUsuario);
router.get('/pagos/inscripcion/:id_inscripcion', pagosController.obtenerPagosPorInscripcion);
router.post('/pagos', pagosController.crearPago);
router.put('/pagos/:id', pagosController.actualizarPago);
router.delete('/pagos/:id', pagosController.eliminarPago);

// ==================== RUTAS DE RESEÑAS ====================
router.get('/resenas', resenasController.listarResenas);
router.get('/resenas/:id', resenasController.obtenerResena);
router.get('/resenas/producto/:id_producto', resenasController.obtenerResenasPorProducto);
router.get('/resenas/usuario/:id_usuario', resenasController.obtenerResenasPorUsuario);
router.post('/resenas', resenasController.crearResena);
router.put('/resenas/:id', resenasController.actualizarResena);
router.delete('/resenas/:id', resenasController.eliminarResena);

// ==================== RUTAS DE TAGS ====================
router.get('/tags', tagsController.listarTags);
router.get('/tags/:id', tagsController.obtenerTag);
router.get('/tags/:id_tag/productos', tagsController.obtenerProductosPorTag);
router.get('/tags/producto/:id_producto', tagsController.obtenerTagsPorProducto);
router.post('/tags', tagsController.crearTag);
router.put('/tags/:id', tagsController.actualizarTag);
router.delete('/tags/:id', tagsController.eliminarTag);

// Rutas para asociar/desasociar tags con productos
router.post('/producto-tags', tagsController.asociarTagProducto);
router.delete('/producto-tags/:id_producto/:id_tag', tagsController.desasociarTagProducto);

module.exports = router;
