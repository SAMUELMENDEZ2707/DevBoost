# 📚 DevBoost - Sistema de Gestión de Cursos

Sistema completo de gestión de cursos con CRUD para todas las tablas y vistas específicas para cada rol.

## 🗂️ Estructura del Proyecto

```
DevBoost/
├── app.js                          # Servidor principal
├── package.json
├── db/
│   ├── devboost_db.sql            # Script de base de datos
│   └── DevBoost.mwb
├── src/
│   ├── controllers/               # Controladores CRUD
│   │   ├── categoriasController.js
│   │   ├── instructoresController.js
│   │   ├── productosController.js
│   │   ├── usuariosController.js
│   │   ├── inscripcionesController.js
│   │   ├── pagosController.js
│   │   ├── resenasController.js
│   │   └── tagsController.js
│   ├── routes/                    # Rutas del sistema
│   │   ├── api.js                # Rutas API REST
│   │   └── views.js              # Rutas de vistas
│   ├── views/                     # Vistas HTML
│   │   ├── admin/
│   │   │   └── dashboard.html    # Panel administrador
│   │   ├── instructor/
│   │   │   └── dashboard.html    # Panel instructor
│   │   └── estudiante/
│   │       └── dashboard.html    # Panel estudiante
│   └── public/
│       ├── login.html
│       └── register.html
```

## 📊 Base de Datos - Tablas

El sistema maneja las siguientes tablas:

1. **categorias** - Categorías de cursos
2. **instructores** - Información de instructores
3. **productos** - Cursos/productos
4. **usuarios** - Usuarios del sistema (admin, instructor, estudiante)
5. **inscripciones** - Matrículas de estudiantes
6. **pagos** - Registro de pagos
7. **reseñas** - Calificaciones y comentarios
8. **tags** - Etiquetas para cursos
9. **producto_tags** - Relación muchos a muchos

## 🔌 API REST - Endpoints

### Categorías
- `GET /api/categorias` - Listar todas
- `GET /api/categorias/:id` - Obtener una
- `POST /api/categorias` - Crear nueva
- `PUT /api/categorias/:id` - Actualizar
- `DELETE /api/categorias/:id` - Eliminar

### Instructores
- `GET /api/instructores` - Listar todos
- `GET /api/instructores/:id` - Obtener uno
- `GET /api/instructores/:id/cursos` - Cursos del instructor
- `POST /api/instructores` - Crear nuevo
- `PUT /api/instructores/:id` - Actualizar
- `DELETE /api/instructores/:id` - Eliminar

### Productos (Cursos)
- `GET /api/productos` - Listar todos
- `GET /api/productos/:id` - Obtener uno
- `GET /api/productos/categoria/:id_categoria` - Por categoría
- `POST /api/productos` - Crear nuevo
- `PUT /api/productos/:id` - Actualizar
- `DELETE /api/productos/:id` - Eliminar

### Usuarios
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Obtener uno
- `GET /api/usuarios/rol/:rol` - Por rol (admin/instructor/estudiante)
- `POST /api/usuarios` - Crear nuevo
- `PUT /api/usuarios/:id` - Actualizar
- `DELETE /api/usuarios/:id` - Eliminar

### Inscripciones
- `GET /api/inscripciones` - Listar todas
- `GET /api/inscripciones/:id` - Obtener una
- `GET /api/inscripciones/usuario/:id_usuario` - Por usuario
- `GET /api/inscripciones/producto/:id_producto` - Por producto
- `POST /api/inscripciones` - Crear nueva
- `PUT /api/inscripciones/:id` - Actualizar
- `DELETE /api/inscripciones/:id` - Eliminar

### Pagos
- `GET /api/pagos` - Listar todos
- `GET /api/pagos/:id` - Obtener uno
- `GET /api/pagos/usuario/:id_usuario` - Por usuario
- `GET /api/pagos/inscripcion/:id_inscripcion` - Por inscripción
- `POST /api/pagos` - Crear nuevo
- `PUT /api/pagos/:id` - Actualizar
- `DELETE /api/pagos/:id` - Eliminar

### Reseñas
- `GET /api/resenas` - Listar todas
- `GET /api/resenas/:id` - Obtener una
- `GET /api/resenas/producto/:id_producto` - Por producto
- `GET /api/resenas/usuario/:id_usuario` - Por usuario
- `POST /api/resenas` - Crear nueva
- `PUT /api/resenas/:id` - Actualizar
- `DELETE /api/resenas/:id` - Eliminar

### Tags
- `GET /api/tags` - Listar todos
- `GET /api/tags/:id` - Obtener uno
- `GET /api/tags/:id_tag/productos` - Productos por tag
- `GET /api/tags/producto/:id_producto` - Tags de un producto
- `POST /api/tags` - Crear nuevo
- `PUT /api/tags/:id` - Actualizar
- `DELETE /api/tags/:id` - Eliminar
- `POST /api/producto-tags` - Asociar tag a producto
- `DELETE /api/producto-tags/:id_producto/:id_tag` - Desasociar

## 👥 Vistas por Rol

### 🔴 Administrador (`/admin/dashboard`)
**Acceso completo a todo el sistema:**
- ✅ CRUD completo de todas las tablas
- 📊 Estadísticas generales
- 👁️ Gestión de usuarios, cursos, categorías, instructores
- 💰 Control de inscripciones y pagos
- ⭐ Moderación de reseñas
- 🏷️ Gestión de tags

**Funcionalidades:**
- Crear, editar y eliminar cursos
- Asignar instructores a cursos
- Gestionar usuarios y roles
- Ver todos los pagos e inscripciones
- Moderar reseñas
- Estadísticas completas del sistema

### 🔵 Instructor (`/instructor/dashboard`)
**Gestión de sus propios cursos:**
- 📚 Ver y editar sus cursos
- 👨‍🎓 Lista de estudiantes inscritos
- ⭐ Ver reseñas de sus cursos
- 📊 Estadísticas de sus cursos

**Funcionalidades:**
- Crear y editar sus propios cursos
- Ver lista de estudiantes por curso
- Ver calificaciones y comentarios
- Estadísticas: total cursos, estudiantes, rating promedio

### 🟢 Estudiante (`/estudiante/dashboard`)
**Panel personal de aprendizaje:**
- 🎓 Mis cursos inscritos
- 💳 Historial de pagos
- ⭐ Mis reseñas
- 📖 Catálogo de cursos disponibles

**Funcionalidades:**
- Ver cursos en los que está inscrito
- Ver progreso y estado de cursos
- Consultar historial de pagos
- Dejar reseñas en cursos completados
- Explorar catálogo para nuevas inscripciones

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
Ejecuta el script SQL:
```bash
mysql -u root -p < db/devboost_db.sql
```

O importa `devboost_db.sql` desde phpMyAdmin/MySQL Workbench

### 3. Configurar conexión (app.js)
Verifica las credenciales en `app.js`:
```javascript
host: 'localhost', 
user: 'samuel07', 
password: 'sql', 
port: 3306, 
database: 'devboost_db'
```

### 4. Iniciar servidor
```bash
node app.js
```

El servidor estará disponible en: `http://localhost:8080`

## 📝 Ejemplos de Uso de la API

### Crear una categoría
```bash
curl -X POST http://localhost:8080/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre_categoria":"Desarrollo Web","descripcion":"Cursos de desarrollo web"}'
```

### Listar productos
```bash
curl http://localhost:8080/api/productos
```

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_producto":"Node.js Avanzado",
    "slug":"nodejs-avanzado",
    "descripcion":"Curso avanzado de Node.js",
    "precio":999.00,
    "id_categoria":2,
    "id_instructor":1,
    "nivel":"Avanzado",
    "duracion_horas":40
  }'
```

### Crear inscripción
```bash
curl -X POST http://localhost:8080/api/inscripciones \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario":2,
    "id_producto":1,
    "precio_pagado":799.00,
    "metodo_pago":"tarjeta",
    "estado":"pagado"
  }'
```

### Crear reseña
```bash
curl -X POST http://localhost:8080/api/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario":2,
    "id_producto":1,
    "rating":5,
    "comentario":"Excelente curso, muy recomendado"
  }'
```

## 🔐 Datos de Prueba

La base de datos incluye datos de ejemplo:

**Usuarios:**
- Admin: samuel@devboost.com
- Estudiante 1: maria@ejemplo.com
- Estudiante 2: jose@ejemplo.com

**Instructores:**
- Ana López (ana@devboost.com)
- Carlos Méndez (carlos@devboost.com)
- Laura Torres (laura@devboost.com)

**15 cursos** en 3 categorías
**7 tags** predefinidos

## 📦 Dependencias

```json
{
  "express": "^5.1.0",
  "express-myconnection": "^1.0.4",
  "mysql": "^2.18.1"
}
```

## 🎯 Características Principales

✅ **CRUD Completo** para todas las tablas
✅ **API REST** bien estructurada
✅ **Vistas específicas** por rol
✅ **Validaciones** en controladores
✅ **Relaciones** entre tablas implementadas
✅ **Datos de prueba** incluidos
✅ **Manejo de errores** apropiado
✅ **Código limpio** y comentado

## 🔄 Próximas Mejoras Sugeridas

- [ ] Implementar autenticación JWT
- [ ] Agregar middleware de autorización por roles
- [ ] Crear scripts JavaScript para las vistas
- [ ] Implementar paginación en listados
- [ ] Agregar búsqueda y filtros avanzados
- [ ] Sistema de notificaciones
- [ ] Carga de imágenes para cursos
- [ ] Generación de certificados
- [ ] Reportes en PDF

## 📄 Licencia

Este proyecto es de uso educativo.

---

**Desarrollado para DevBoost** 🚀
