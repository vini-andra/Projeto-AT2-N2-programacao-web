const bcrypt = require('bcryptjs');

const RODADAS = 10;

//todo hash do bcrypt começa com $2a$, $2b$ ou $2y$ seguido do custo
const jaCriptografada = (senha) => /^\$2[aby]\$\d{2}\$/.test(senha);

//a tela de usuários reenvia o hash salvo ao editar, por isso não criptografa duas vezes
const criptografarSenha = async (senha) => {
    if (jaCriptografada(senha)) return senha;
    return bcrypt.hash(String(senha), RODADAS);
};

const conferirSenha = (senha, hash) => bcrypt.compare(String(senha), String(hash));

//nem o hash da senha sai do backend
const semSenha = ({ senha, ...resto }) => resto;

module.exports = { jaCriptografada, criptografarSenha, conferirSenha, semSenha };
