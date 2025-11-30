// Controlador CRUD para Pagos

// Listar todos los pagos
exports.listarPagos = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email,
                   i.id_producto, pr.nombre_producto
            FROM pagos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN inscripciones i ON p.id_inscripcion = i.id_inscripcion
            LEFT JOIN productos pr ON i.id_producto = pr.id_producto
            ORDER BY p.fecha_pago DESC
        `;
        
        conn.query(query, (err, pagos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener pagos' });
            res.json(pagos);
        });
    });
};

// Obtener un pago por ID
exports.obtenerPago = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email,
                   i.id_producto, pr.nombre_producto
            FROM pagos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN inscripciones i ON p.id_inscripcion = i.id_inscripcion
            LEFT JOIN productos pr ON i.id_producto = pr.id_producto
            WHERE p.id_pago = ?
        `;
        
        conn.query(query, [id], (err, pago) => {
            if (err) return res.status(500).json({ error: 'Error al obtener pago' });
            if (pago.length === 0) return res.status(404).json({ error: 'Pago no encontrado' });
            res.json(pago[0]);
        });
    });
};

// Crear nuevo pago
exports.crearPago = (req, res) => {
    const { id_inscripcion, id_usuario, monto, metodo, estado } = req.body;
    
    if (!id_inscripcion || !id_usuario || !monto) {
        return res.status(400).json({ error: 'Inscripción, usuario y monto son requeridos' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { 
            id_inscripcion, 
            id_usuario, 
            monto, 
            metodo, 
            estado: estado || 'completado' 
        };
        
        conn.query('INSERT INTO pagos SET ?', datos, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear pago' });
            res.status(201).json({ 
                message: 'Pago registrado exitosamente',
                id_pago: result.insertId 
            });
        });
    });
};

// Actualizar pago
exports.actualizarPago = (req, res) => {
    const { id } = req.params;
    const { monto, metodo, estado } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { monto, metodo, estado };
        
        conn.query('UPDATE pagos SET ? WHERE id_pago = ?', [datos, id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar pago' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Pago no encontrado' });
            res.json({ message: 'Pago actualizado exitosamente' });
        });
    });
};

// Eliminar pago
exports.eliminarPago = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM pagos WHERE id_pago = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar pago' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Pago no encontrado' });
            res.json({ message: 'Pago eliminado exitosamente' });
        });
    });
};

// Obtener pagos de un usuario
exports.obtenerPagosPorUsuario = (req, res) => {
    const { id_usuario } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, i.id_producto, pr.nombre_producto
            FROM pagos p
            LEFT JOIN inscripciones i ON p.id_inscripcion = i.id_inscripcion
            LEFT JOIN productos pr ON i.id_producto = pr.id_producto
            WHERE p.id_usuario = ?
            ORDER BY p.fecha_pago DESC
        `;
        
        conn.query(query, [id_usuario], (err, pagos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener pagos' });
            res.json(pagos);
        });
    });
};

// Obtener pagos de una inscripción
exports.obtenerPagosPorInscripcion = (req, res) => {
    const { id_inscripcion } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM pagos WHERE id_inscripcion = ? ORDER BY fecha_pago DESC', [id_inscripcion], (err, pagos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener pagos' });
            res.json(pagos);
        });
    });
};
