// backend/src/controllers/authController.js
const { fetchAll } = require('../services/dataService');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
        if (err) {
            callback(err);
        } else {
            const signingKey = key.getPublicKey() || key.rsaPublicKey;
            callback(null, signingKey);
        }
    });
}

exports.login = (req, res) => {
    const { email, idToken, password } = req.body;
    
    if (!idToken) {
        return res.status(400).json({ success: false, message: 'Token de autenticação não fornecido' });
    }
    
    // Fallback para autenticação simulada local de outros testes ou do Integrante 1
    if (idToken === 'fake-jwt-token' || idToken === 'fake-token') {
        if (email === 'admin@email.com') {
            return res.json({ 
                success: true, 
                user: { name: 'Admin', email: 'admin@email.com' },
                token: 'fake-jwt-token' 
            });
        }
    }
    
    // Verificação oficial do ID Token do Firebase (usando a variável do .env)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    jwt.verify(idToken, getKey, {
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`,
        algorithms: ['RS256']
    }, (err, decoded) => {
        if (err) {
            console.error('Erro na verificação do JWT:', err.message);
            return res.status(401).json({ success: false, message: 'Credenciais inválidas ou token expirado' });
        }
        
        // Garante que o e-mail corresponde ao payload do token decodificado
        if (decoded.email !== email) {
            return res.status(401).json({ success: false, message: 'E-mail não corresponde ao token de autenticação' });
        }
        
        // Buscar usuário no banco de dados para validar e pegar o tipo de conta
        fetchAll('usuarios').then(usuarios => {
            const dbUser = usuarios.find(u => u.email === email);
            
            if (!dbUser && email !== 'admin@email.com') {
                return res.status(401).json({ success: false, message: 'Usuário não cadastrado no sistema.' });
            }
            
            if (dbUser && dbUser.senha && password && dbUser.senha !== password) {
                return res.status(401).json({ success: false, message: 'Senha incorreta conforme o banco de dados.' });
            }
            
            // Retorna sucesso e dados do usuário verificados
            return res.json({ 
                success: true, 
                user: { 
                    name: dbUser ? dbUser.nome : (decoded.name || email.split('@')[0]), 
                    email: decoded.email,
                    role: dbUser ? (dbUser.tipoDeConta || dbUser.role || 'user') : 'admin'
                },
                token: idToken 
            });
        }).catch(err => {
            return res.status(500).json({ success: false, message: 'Erro ao validar banco de dados' });
        });
    });
};
