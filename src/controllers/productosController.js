// Controlador CRUD para Productos (Cursos)

// Listar todos los productos
exports.listarProductos = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, c.nombre_categoria, i.nombre as instructor_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN instructores i ON p.id_instructor = i.id_instructor
            ORDER BY p.created_at DESC
        `;
        
        conn.query(query, (err, productos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener productos' });
            res.json(productos);
        });
    });
};

// Obtener un producto por ID
exports.obtenerProducto = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, c.nombre_categoria, i.nombre as instructor_nombre, i.email as instructor_email
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN instructores i ON p.id_instructor = i.id_instructor
            WHERE p.id_producto = ?
        `;
        
        conn.query(query, [id], (err, producto) => {
            if (err) return res.status(500).json({ error: 'Error al obtener producto' });
            if (producto.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(producto[0]);
        });
    });
};

// Crear nuevo producto
exports.crearProducto = (req, res) => {
    const { 
        nombre_producto, slug, descripcion, precio, 
        id_categoria, id_instructor, nivel, duracion_horas, activo 
    } = req.body;
    
    if (!nombre_producto || !id_categoria) {
        return res.status(400).json({ error: 'Nombre del producto y categoría son requeridos' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { 
            nombre_producto, slug, descripcion, precio, 
            id_categoria, id_instructor, nivel, duracion_horas, 
            activo: activo !== undefined ? activo : 1 
        };
        
        conn.query('INSERT INTO productos SET ?', datos, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El slug ya está en uso' });
                }
                return res.status(500).json({ error: 'Error al crear producto' });
            }
            res.status(201).json({ 
                message: 'Producto creado exitosamente',
                id_producto: result.insertId 
            });
        });
    });
};

// Actualizar producto
exports.actualizarProducto = (req, res) => {
    const { id } = req.params;
    const { 
        nombre_producto, slug, descripcion, precio, 
        id_categoria, id_instructor, nivel, duracion_horas, activo 
    } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { 
            nombre_producto, slug, descripcion, precio, 
            id_categoria, id_instructor, nivel, duracion_horas, activo 
        };
        
        conn.query('UPDATE productos SET ? WHERE id_producto = ?', [datos, id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El slug ya está en uso' });
                }
                return res.status(500).json({ error: 'Error al actualizar producto' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json({ message: 'Producto actualizado exitosamente' });
        });
    });
};

// Eliminar producto
exports.eliminarProducto = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM productos WHERE id_producto = ?', [id], (err, result) => {
            if (err) {
                if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                    return res.status(400).json({ error: 'No se puede eliminar: existen inscripciones para este producto' });
                }
                return res.status(500).json({ error: 'Error al eliminar producto' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json({ message: 'Producto eliminado exitosamente' });
        });
    });
};

// Obtener productos por categoría
exports.obtenerProductosPorCategoria = (req, res) => {
    const { id_categoria } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, i.nombre as instructor_nombre
            FROM productos p
            LEFT JOIN instructores i ON p.id_instructor = i.id_instructor
            WHERE p.id_categoria = ? AND p.activo = 1
            ORDER BY p.created_at DESC
        `;
        
        conn.query(query, [id_categoria], (err, productos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener productos' });
            res.json(productos);
        });
    });
};
