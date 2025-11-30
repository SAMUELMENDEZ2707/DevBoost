// Controlador CRUD para Reseñas

// Listar todas las reseñas
exports.listarResenas = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT r.*, u.nombre as usuario_nombre, p.nombre_producto
            FROM reseñas r
            LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
            LEFT JOIN productos p ON r.id_producto = p.id_producto
            ORDER BY r.created_at DESC
        `;
        
        conn.query(query, (err, resenas) => {
            if (err) return res.status(500).json({ error: 'Error al obtener reseñas' });
            res.json(resenas);
        });
    });
};

// Obtener una reseña por ID
exports.obtenerResena = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT r.*, u.nombre as usuario_nombre, u.email as usuario_email,
                   p.nombre_producto
            FROM reseñas r
            LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
            LEFT JOIN productos p ON r.id_producto = p.id_producto
            WHERE r.id_resena = ?
        `;
        
        conn.query(query, [id], (err, resena) => {
            if (err) return res.status(500).json({ error: 'Error al obtener reseña' });
            if (resena.length === 0) return res.status(404).json({ error: 'Reseña no encontrada' });
            res.json(resena[0]);
        });
    });
};

// Crear nueva reseña
exports.crearResena = (req, res) => {
    const { id_usuario, id_producto, rating, comentario } = req.body;
    
    if (!id_usuario || !id_producto || !rating) {
        return res.status(400).json({ error: 'Usuario, producto y calificación son requeridos' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { id_usuario, id_producto, rating, comentario };
        
        conn.query('INSERT INTO reseñas SET ?', datos, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear reseña' });
            res.status(201).json({ 
                message: 'Reseña creada exitosamente',
                id_resena: result.insertId 
            });
        });
    });
};

// Actualizar reseña
exports.actualizarResena = (req, res) => {
    const { id } = req.params;
    const { rating, comentario } = req.body;
    
    if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { rating, comentario };
        
        conn.query('UPDATE reseñas SET ? WHERE id_resena = ?', [datos, id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar reseña' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Reseña no encontrada' });
            res.json({ message: 'Reseña actualizada exitosamente' });
        });
    });
};

// Eliminar reseña
exports.eliminarResena = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM reseñas WHERE id_resena = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar reseña' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Reseña no encontrada' });
            res.json({ message: 'Reseña eliminada exitosamente' });
        });
    });
};

// Obtener reseñas de un producto
exports.obtenerResenasPorProducto = (req, res) => {
    const { id_producto } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT r.*, u.nombre as usuario_nombre
            FROM reseñas r
            LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
            WHERE r.id_producto = ?
            ORDER BY r.created_at DESC
        `;
        
        conn.query(query, [id_producto], (err, resenas) => {
            if (err) return res.status(500).json({ error: 'Error al obtener reseñas' });
            res.json(resenas);
        });
    });
};

// Obtener reseñas de un usuario
exports.obtenerResenasPorUsuario = (req, res) => {
    const { id_usuario } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT r.*, p.nombre_producto
            FROM reseñas r
            LEFT JOIN productos p ON r.id_producto = p.id_producto
            WHERE r.id_usuario = ?
            ORDER BY r.created_at DESC
        `;
        
        conn.query(query, [id_usuario], (err, resenas) => {
            if (err) return res.status(500).json({ error: 'Error al obtener reseñas' });
            res.json(resenas);
        });
    });
};
