const express = require('express');
const router = express.Router();
const path = require('path');

// Rutas para vistas de admin
router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/dashboard.html'));
});

// Rutas para vistas de instructor
router.get('/instructor/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/instructor/dashboard.html'));
});

// Rutas para vistas de estudiante
router.get('/estudiante/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/estudiante/dashboard.html'));
});

// Redirección según rol (después de login)
router.get('/dashboard', (req, res) => {
    // Aquí deberías verificar el rol del usuario desde la sesión
    // Por ahora redirecciona a estudiante por defecto
    const rol = req.session?.rol || 'estudiante';
    
    switch(rol) {
        case 'admin':
            res.redirect('/admin/dashboard');
            break;
        case 'instructor':
            res.redirect('/instructor/dashboard');
            break;
        case 'estudiante':
        default:
            res.redirect('/estudiante/dashboard');
            break;
    }
});

module.exports = router;
