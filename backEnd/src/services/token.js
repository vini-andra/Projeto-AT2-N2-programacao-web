const crypto = require('crypto');
const jwt = require('jsonwebtoken');

//sem JWT_SECRET no .env o segredo muda a cada start, e os tokens antigos deixam de valer
const segredo = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

const gerarToken = (usuario) => jwt.sign(usuario, segredo, { expiresIn: '8h' });

const lerToken = (token) => jwt.verify(token, segredo);

module.exports = { gerarToken, lerToken };
