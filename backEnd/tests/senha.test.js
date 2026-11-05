const fs = require('fs');
const path = require('path');
const { jaCriptografada, criptografarSenha, conferirSenha } = require('../src/services/senha');
const protegerSenha = require('../src/middlewares/protegerSenha');

describe('hash de senha', () => {
    test('gera um hash diferente da senha e confere a senha certa', async () => {
        const hash = await criptografarSenha('123456');

        expect(hash).not.toBe('123456');
        expect(jaCriptografada(hash)).toBe(true);
        expect(await conferirSenha('123456', hash)).toBe(true);
    });

    test('não confere uma senha errada', async () => {
        const hash = await criptografarSenha('123456');
        expect(await conferirSenha('654321', hash)).toBe(false);
    });

    test('não criptografa de novo uma senha que já é hash', async () => {
        const hash = await criptografarSenha('123456');
        expect(await criptografarSenha(hash)).toBe(hash);
    });

    test('protegerSenha troca a senha do body pelo hash e segue adiante', async () => {
        const req = { body: { nome: 'Ana', senha: 'segredo' } };
        const next = jest.fn();

        await protegerSenha(req, {}, next);

        expect(req.body.nome).toBe('Ana');
        expect(await conferirSenha('segredo', req.body.senha)).toBe(true);
        expect(next).toHaveBeenCalled();
    });

    test('mock_db.json não tem nenhuma senha em texto puro', () => {
        const arquivo = path.join(__dirname, '../mock_db.json');
        const { usuarios } = JSON.parse(fs.readFileSync(arquivo, 'utf8'));

        usuarios.forEach((usuario) => {
            expect(jaCriptografada(usuario.senha)).toBe(true);
        });
    });
});
