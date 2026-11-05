const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { fetchAll, createItem } = require('../services/dataService');
const { conferirSenha } = require('../services/senha');
const { gerarToken } = require('../services/token');

const client = jwksClient({
    jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
});

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        callback(null, key.getPublicKey() || key.rsaPublicKey);
    });
};

const verificarTokenFirebase = (idToken) => {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const opcoes = {
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`,
        algorithms: ['RS256']
    };

    return new Promise((resolve, reject) => {
        jwt.verify(idToken, getKey, opcoes, (err, decoded) => (err ? reject(err) : resolve(decoded)));
    });
};

const buscarUsuario = async (email) => {
    const usuarios = await fetchAll('usuarios');
    return usuarios.find((u) => u.email === email);
};

const negar = (res, message) => res.status(401).json({ success: false, message });

const responderComToken = (res, usuario) => {
    const user = {
        name: usuario.nome,
        email: usuario.email,
        role: usuario.tipoDeConta || usuario.role || 'user'
    };
    return res.json({ success: true, user, token: gerarToken(user) });
};

//login sem Firebase: confere e-mail e senha direto no banco
const loginComSenha = async (res, email, password) => {
    const usuario = await buscarUsuario(email);
    if (!usuario || !usuario.senha || !(await conferirSenha(password, usuario.senha))) {
        return negar(res, 'E-mail ou senha incorretos.');
    }
    return responderComToken(res, usuario);
};

const loginComFirebase = async (res, email, idToken, password) => {
    let decoded;
    try {
        decoded = await verificarTokenFirebase(idToken);
    } catch (err) {
        return negar(res, 'Credenciais inválidas ou token expirado');
    }

    if (decoded.email !== email) {
        return negar(res, 'E-mail não corresponde ao token de autenticação');
    }

    let usuario = await buscarUsuario(email);

    if (!usuario && password) {
        return negar(res, 'Usuário não cadastrado no sistema.');
    }

    //sem senha e sem cadastro é o primeiro login pelo Google, então cria o usuário
    if (!usuario) {
        usuario = await createItem('usuarios', {
            nome: decoded.name || email.split('@')[0],
            email: decoded.email,
            telefone: 'Não informado',
            tipoDeConta: 'user',
            ativo: true
        });
    }

    if (password && usuario.senha && !(await conferirSenha(password, usuario.senha))) {
        return negar(res, 'Senha incorreta conforme o banco de dados.');
    }

    return responderComToken(res, usuario);
};

exports.login = async (req, res) => {
    const { email, idToken, password } = req.body || {};

    if (!email || (!idToken && !password)) {
        return res.status(400).json({ success: false, message: 'Informe o e-mail e a senha ou o token de autenticação' });
    }

    try {
        if (idToken) return await loginComFirebase(res, email, idToken, password);
        return await loginComSenha(res, email, password);
    } catch (error) {
        console.error('[authController] Erro no login:', error.message);
        return res.status(500).json({ success: false, message: 'Erro ao validar banco de dados' });
    }
};
