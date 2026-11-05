const { criptografarSenha } = require('../services/senha');

const protegerSenha = async (req, res, next) => {
    if (req.body && req.body.senha) {
        req.body.senha = await criptografarSenha(req.body.senha);
    }
    next();
};

module.exports = protegerSenha;
