// Controlador CRUD para Usuarios

// Listar todos los usuarios
exports.listarUsuarios = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT id_usuario, nombre, email, telefono, rol, created_at FROM usuarios ORDER BY created_at DESC', (err, usuarios) => {
            if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
            res.json(usuarios);
        });
    });
};

// Obtener un usuario por ID
exports.obtenerUsuario = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT id_usuario, nombre, email, telefono, rol, created_at FROM usuarios WHERE id_usuario = ?', [id], (err, usuario) => {
            if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
            if (usuario.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(usuario[0]);
        });
    });
};

// Crear nuevo usuario
exports.crearUsuario = (req, res) => {
    const { nombre, email, password_hash, telefono, rol } = req.body;
    
    if (!nombre || !email || !password_hash) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { 
            nombre, 
            email, 
            password_hash, 
            telefono, 
            rol: rol || 'estudiante' 
        };
        
        conn.query('INSERT INTO usuarios SET ?', datos, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
                return res.status(500).json({ error: 'Error al crear usuario' });
            }
            res.status(201).json({ 
                message: 'Usuario creado exitosamente',
                id_usuario: result.insertId 
            });
        });
    });
};

// Actualizar usuario
exports.actualizarUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, rol } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre, email, telefono, rol };
        
        conn.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [datos, id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
                return res.status(500).json({ error: 'Error al actualizar usuario' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json({ message: 'Usuario actualizado exitosamente' });
        });
    });
};

// Eliminar usuario
exports.eliminarUsuario = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json({ message: 'Usuario eliminado exitosamente' });
        });
    });
};

// Obtener usuarios por rol
exports.obtenerUsuariosPorRol = (req, res) => {
    const { rol } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT id_usuario, nombre, email, telefono, rol, created_at FROM usuarios WHERE rol = ? ORDER BY created_at DESC', [rol], (err, usuarios) => {
            if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
            res.json(usuarios);
        });
    });
};
