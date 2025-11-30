// Controlador CRUD para Categorías

// Listar todas las categorías
exports.listarCategorias = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM categorias ORDER BY id_categoria DESC', (err, categorias) => {
            if (err) return res.status(500).json({ error: 'Error al obtener categorías' });
            res.json(categorias);
        });
    });
};

// Obtener una categoría por ID
exports.obtenerCategoria = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('SELECT * FROM categorias WHERE id_categoria = ?', [id], (err, categoria) => {
            if (err) return res.status(500).json({ error: 'Error al obtener categoría' });
            if (categoria.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.json(categoria[0]);
        });
    });
};

// Crear nueva categoría
exports.crearCategoria = (req, res) => {
    const { nombre_categoria, descripcion } = req.body;
    
    if (!nombre_categoria) {
        return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre_categoria, descripcion };
        conn.query('INSERT INTO categorias SET ?', datos, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear categoría' });
            res.status(201).json({ 
                message: 'Categoría creada exitosamente',
                id_categoria: result.insertId 
            });
        });
    });
};

// Actualizar categoría
exports.actualizarCategoria = (req, res) => {
    const { id } = req.params;
    const { nombre_categoria, descripcion } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        const datos = { nombre_categoria, descripcion };
        conn.query('UPDATE categorias SET ? WHERE id_categoria = ?', [datos, id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar categoría' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.json({ message: 'Categoría actualizada exitosamente' });
        });
    });
};

// Eliminar categoría
exports.eliminarCategoria = (req, res) => {
    const { id } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión' });
        
        conn.query('DELETE FROM categorias WHERE id_categoria = ?', [id], (err, result) => {
            if (err) {
                if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                    return res.status(400).json({ error: 'No se puede eliminar: existen productos en esta categoría' });
                }
                return res.status(500).json({ error: 'Error al eliminar categoría' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.json({ message: 'Categoría eliminada exitosamente' });
        });
    });
};
