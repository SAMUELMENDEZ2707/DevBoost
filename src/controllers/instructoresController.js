// Controlador CRUD para Instructores

// Listar todos los instructores
exports.listarInstructores = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM instructores ORDER BY id_instructor DESC', (err, instructores) => {
            if (err) return res.status(500).json({ error: 'Error al obtener instructores' });
            res.json(instructores);
        });
    });
};

// Obtener un instructor por ID
exports.obtenerInstructor = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM instructores WHERE id_instructor = ?', [id], (err, instructor) => {
            if (err) return res.status(500).json({ error: 'Error al obtener instructor' });
            if (instructor.length === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
            res.json(instructor[0]);
        });
    });
};

// Crear nuevo instructor
exports.crearInstructor = (req, res) => {
    const { nombre, email, bio } = req.body;
    
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre, email, bio };
        conn.query('INSERT INTO instructores SET ?', datos, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
                return res.status(500).json({ error: 'Error al crear instructor' });
            }
            res.status(201).json({ 
                message: 'Instructor creado exitosamente',
                id_instructor: result.insertId 
            });
        });
    });
};

// Actualizar instructor
exports.actualizarInstructor = (req, res) => {
    const { id } = req.params;
    const { nombre, email, bio } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre, email, bio };
        conn.query('UPDATE instructores SET ? WHERE id_instructor = ?', [datos, id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
                return res.status(500).json({ error: 'Error al actualizar instructor' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
            res.json({ message: 'Instructor actualizado exitosamente' });
        });
    });
};

// Eliminar instructor
exports.eliminarInstructor = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM instructores WHERE id_instructor = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar instructor' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
            res.json({ message: 'Instructor eliminado exitosamente' });
        });
    });
};

// Obtener cursos de un instructor
exports.obtenerCursosInstructor = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const query = `
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE p.id_instructor = ?
            ORDER BY p.created_at DESC
        `;
        
        conn.query(query, [id], (err, cursos) => {
            if (err) return res.status(500).json({ error: 'Error al obtener cursos' });
            res.json(cursos);
        });
    });
};
