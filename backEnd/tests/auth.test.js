//sem projeto Firebase o dataService usa o mock_db.json
delete process.env.FIREBASE_PROJECT_ID;
jest.spyOn(console, 'warn').mockImplementation(() => {});

const request = require('supertest');
const app = require('../src/app');
const { gerarToken } = require('../src/services/token');

const tokenValido = gerarToken({ name: 'Teste', email: 'teste@cevada.com', role: 'admin' });

describe('rotas de dados sem token', () => {
    test('GET /api/produtos responde 401', async () => {
        const res = await request(app).get('/api/produtos');
        expect(res.status).toBe(401);
    });

    test('GET /api/usuarios responde 401', async () => {
        const res = await request(app).get('/api/usuarios');
        expect(res.status).toBe(401);
    });

    test('DELETE /api/produtos/:id responde 401', async () => {
        const res = await request(app).delete('/api/produtos/zye1w32');
        expect(res.status).toBe(401);
    });

    test('token inválido responde 401', async () => {
        const res = await request(app)
            .get('/api/categorias')
            .set('Authorization', 'Bearer token-inventado');
        expect(res.status).toBe(401);
    });
});

describe('rotas de dados com token', () => {
    test('GET /api/produtos responde 200 com a lista', async () => {
        const res = await request(app)
            .get('/api/produtos')
            .set('Authorization', `Bearer ${tokenValido}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/usuarios não expõe a senha', async () => {
        const res = await request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${tokenValido}`);

        expect(res.body.data.length).toBeGreaterThan(0);
        res.body.data.forEach((usuario) => expect(usuario).not.toHaveProperty('senha'));
    });
});

describe('POST /api/login', () => {
    test('senha correta devolve um token que abre as rotas de dados', async () => {
        const login = await request(app)
            .post('/api/login')
            .send({ email: 'admin@email.com', password: '1234' });

        expect(login.status).toBe(200);
        expect(login.body.user.role).toBe('admin');

        const res = await request(app)
            .get('/api/categorias')
            .set('Authorization', `Bearer ${login.body.token}`);
        expect(res.status).toBe(200);
    });

    test('senha errada responde 401', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'admin@email.com', password: 'errada' });
        expect(res.status).toBe(401);
    });

    test('usuário inexistente responde 401', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'ninguem@cevada.com', password: '1234' });
        expect(res.status).toBe(401);
    });

    test('token do Firebase inválido responde 401', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'admin@email.com', idToken: 'nao-e-um-jwt' });
        expect(res.status).toBe(401);
    });

    test('sem senha e sem token responde 400', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'admin@email.com' });
        expect(res.status).toBe(400);
    });
});
