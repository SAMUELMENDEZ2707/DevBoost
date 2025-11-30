// Controlador CRUD para Inscripciones

// Listar todas las inscripciones
exports.listarInscripciones = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT i.*, u.nombre as usuario_nombre, u.email as usuario_email,
                   p.nombre_producto, p.precio as precio_original
            FROM inscripciones i
            LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
            LEFT JOIN productos p ON i.id_producto = p.id_producto
            ORDER BY i.fecha_inscripcion DESC
        `;
        
        conn.query(query, (err, inscripciones) => {
            if (err) return res.status(500).json({ error: 'Error al obtener inscripciones' });
            res.json(inscripciones);
        });
    });
};

// Obtener una inscripción por ID
exports.obtenerInscripcion = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT i.*, u.nombre as usuario_nombre, u.email as usuario_email,
                   p.nombre_producto, p.descripcion, p.precio as precio_original
            FROM inscripciones i
            LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
            LEFT JOIN productos p ON i.id_producto = p.id_producto
            WHERE i.id_inscripcion = ?
        `;
        
        conn.query(query, [id], (err, inscripcion) => {
            if (err) return res.status(500).json({ error: 'Error al obtener inscripción' });
            if (inscripcion.length === 0) return res.status(404).json({ error: 'Inscripción no encontrada' });
            res.json(inscripcion[0]);
        });
    });
};

// Crear nueva inscripción
exports.crearInscripcion = (req, res) => {
    const { id_usuario, id_producto, precio_pagado, metodo_pago, estado } = req.body;
    
    if (!id_usuario || !id_producto) {
        return res.status(400).json({ error: 'Usuario y producto son requeridos' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { 
            id_usuario, 
            id_producto, 
            precio_pagado, 
            metodo_pago, 
            estado: estado || 'pendiente' 
        };
        
        conn.query('INSERT INTO inscripciones SET ?', datos, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear inscripción' });
            res.status(201).json({ 
                message: 'Inscripción creada exitosamente',
                id_inscripcion: result.insertId 
            });
        });
    });
};

// Actualizar inscripción
exports.actualizarInscripcion = (req, res) => {
    const { id } = req.params;
    const { precio_pagado, metodo_pago, estado, fecha_finalizacion } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { precio_pagado, metodo_pago, estado, fecha_finalizacion };
        
        conn.query('UPDATE inscripciones SET ? WHERE id_inscripcion = ?', [datos, id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar inscripción' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Inscripción no encontrada' });
            res.json({ message: 'Inscripción actualizada exitosamente' });
        });
    });
};

// Eliminar inscripción
exports.eliminarInscripcion = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM inscripciones WHERE id_inscripcion = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar inscripción' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Inscripción no encontrada' });
            res.json({ message: 'Inscripción eliminada exitosamente' });
        });
    });
};

// Obtener inscripciones de un usuario
exports.obtenerInscripcionesPorUsuario = (req, res) => {
    const { id_usuario } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT i.*, p.nombre_producto, p.descripcion, p.duracion_horas, p.nivel
            FROM inscripciones i
            LEFT JOIN productos p ON i.id_producto = p.id_producto
            WHERE i.id_usuario = ?
            ORDER BY i.fecha_inscripcion DESC
        `;
        
        conn.query(query, [id_usuario], (err, inscripciones) => {
            if (err) return res.status(500).json({ error: 'Error al obtener inscripciones' });
            res.json(inscripciones);
        });
    });
};

// Obtener inscripciones de un producto
exports.obtenerInscripcionesPorProducto = (req, res) => {
    const { id_producto } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT i.*, u.nombre as usuario_nombre, u.email as usuario_email
            FROM inscripciones i
            LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
            WHERE i.id_producto = ?
            ORDER BY i.fecha_inscripcion DESC
        `;
        
        conn.query(query, [id_producto], (err, inscripciones) => {
            if (err) return res.status(500).json({ error: 'Error al obtener inscripciones' });
            res.json(inscripciones);
        });
    });
};
