// backend/src/controllers/authController.js

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    // Simulated auth (Estrutura Base)
    // O Integrante 2 poderá implementar a lógica real aqui
    if (email === 'admin@email.com' && password === '1234') {
        return res.json({ 
            success: true, 
            user: { name: 'Admin', email: 'admin@email.com' },
            token: 'fake-jwt-token' 
        });
    }
    
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
};
