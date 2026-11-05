const { lerToken } = require('../services/token');

const exigirToken = (req, res, next) => {
    const [tipo, token] = (req.headers.authorization || '').split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ success: false, message: 'Token de acesso não informado' });
    }

    try {
        req.usuario = lerToken(token);
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
    }
};

module.exports = exigirToken;
