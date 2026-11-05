jest.mock('../src/services/dataService');

const dataService = require('../src/services/dataService');
const { getAll, create, update, remove } = require('../src/controllers/dataController');

const respostaFalsa = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('CRUD genérico', () => {
    test('getAll devolve os itens da coleção', async () => {
        dataService.fetchAll.mockResolvedValue([{ id: '1', nome: 'Pilsen' }]);
        const res = respostaFalsa();

        await getAll('produtos')({}, res);

        expect(dataService.fetchAll).toHaveBeenCalledWith('produtos');
        expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: '1', nome: 'Pilsen' }] });
    });

    test('getAll responde 500 quando o banco falha', async () => {
        dataService.fetchAll.mockRejectedValue(new Error('fora do ar'));
        const res = respostaFalsa();

        await getAll('produtos')({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('create recusa body vazio com 400', async () => {
        const res = respostaFalsa();

        await create('categorias')({ body: {} }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(dataService.createItem).not.toHaveBeenCalled();
    });

    test('create responde 201 com o item criado', async () => {
        dataService.createItem.mockResolvedValue({ id: 'abc', nome: 'Insumos' });
        const res = respostaFalsa();

        await create('categorias')({ body: { nome: 'Insumos' } }, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'abc', nome: 'Insumos' } });
    });

    test('update recusa campos vazios com 400', async () => {
        const res = respostaFalsa();

        await update('produtos')({ params: { id: '1' }, body: {} }, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('getAll e update nunca devolvem a senha, nem em hash', async () => {
        const ana = { id: 'u1', nome: 'Ana', senha: '$2a$10$hashqualquer' };
        dataService.fetchAll.mockResolvedValue([ana]);
        dataService.updateItem.mockResolvedValue(ana);

        const lista = respostaFalsa();
        await getAll('usuarios')({}, lista);
        const atualizado = respostaFalsa();
        await update('usuarios')({ params: { id: 'u1' }, body: { nome: 'Ana' } }, atualizado);

        expect(lista.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'u1', nome: 'Ana' }] });
        expect(atualizado.json).toHaveBeenCalledWith({ success: true, data: { id: 'u1', nome: 'Ana' } });
    });

    test('remove apaga o item pelo id', async () => {
        dataService.deleteItem.mockResolvedValue();
        const res = respostaFalsa();

        await remove('produtos')({ params: { id: '1' } }, res);

        expect(dataService.deleteItem).toHaveBeenCalledWith('produtos', '1');
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});
