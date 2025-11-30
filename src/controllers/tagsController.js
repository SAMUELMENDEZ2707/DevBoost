// Controlador CRUD para Tags

// Listar todos los tags
exports.listarTags = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM tags ORDER BY nombre ASC', (err, tags) => {
            if (err) return res.status(500).json({ error: 'Error al obtener tags' });
            res.json(tags);
        });
    });
};

// Obtener un tag por ID
exports.obtenerTag = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM tags WHERE id_tag = ?', [id], (err, tag) => {
            if (err) return res.status(500).json({ error: 'Error al obtener tag' });
            if (tag.length === 0) return res.status(404).json({ error: 'Tag no encontrado' });
            res.json(tag[0]);
        });
    });
};

// Crear nuevo tag
exports.crearTag = (req, res) => {
    const { nombre } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del tag es requerido' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre };
        conn.query('INSERT INTO tags SET ?', datos, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El tag ya existe' });
                }
                return res.status(500).json({ error: 'Error al crear tag' });
            }
            res.status(201).json({ 
                message: 'Tag creado exitosamente',
                id_tag: result.insertId 
            });
        });
    });
};

// Actualizar tag
exports.actualizarTag = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre };
        conn.query('UPDATE tags SET ? WHERE id_tag = ?', [datos, id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El tag ya existe' });
                }
                return res.status(500).json({ error: 'Error al actualizar tag' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Tag no encontrado' });
            res.json({ message: 'Tag actualizado exitosamente' });
        });
    });
};

// Eliminar tag
exports.eliminarTag = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM tags WHERE id_tag = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar tag' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Tag no encontrado' });
            res.json({ message: 'Tag eliminado exitosamente' });
        });
    });
};

// Asociar tag a producto
exports.asociarTagProducto = (req, res) => {
    const { id_producto, id_tag } = req.body;
    
    if (!id_producto || !id_tag) {
        return res.status(400).json({ error: 'Producto y tag son requeridos' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { id_producto, id_tag };
        conn.query('INSERT INTO producto_tags SET ?', datos, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El tag ya está asociado a este producto' });
                }
                return res.status(500).json({ error: 'Error al asociar tag' });
            }
            res.status(201).json({ message: 'Tag asociado exitosamente' });
        });
    });
};

// Desasociar tag de producto
exports.desasociarTagProducto = (req, res) => {
    const { id_producto, id_tag } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM producto_tags WHERE id_producto = ? AND id_tag = ?', [id_producto, id_tag], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al desasociar tag' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Asociación no encontrada' });
            res.json({ message: 'Tag desasociado exitosamente' });
        });
    });
};

// Obtener tags de un producto
exports.obtenerTagsPorProducto = (req, res) => {
    const { id_producto } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT t.* FROM tags t
            INNER JOIN producto_tags pt ON t.id_tag = pt.id_tag
            WHERE pt.id_producto = ?
            ORDER BY t.nombre ASC
        `;
        
        conn.query(query, [id_producto], (err, tags) => {
            if (err) return res.status(500).json({ error: 'Error al obtener tags' });
            res.json(tags);
        });
    });
};

// Obtener productos por tag
exports.obtenerProductosPorTag = (req, res) => {
    const { id_tag } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.* FROM productos p
            INNER JOIN producto_tags pt ON p.id_producto = pt.id_producto
            WHERE pt.id_tag = ?
            ORDER BY p.created_at DESC
        `;
        
        conn.query(query, [id_tag], (err, productos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener productos' });
            res.json(productos);
        });
    });
};
