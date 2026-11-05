//sem projeto Firebase o dataService cai no mock_db.json
delete process.env.FIREBASE_PROJECT_ID;
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

const fs = require('fs');
const { fetchAll, createItem, updateItem, deleteItem } = require('../src/services/dataService');

//lê o arquivo de verdade, mas não deixa o teste gravar nele
const gravacao = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

const ultimoBancoGravado = () => JSON.parse(gravacao.mock.calls.at(-1)[1]);

beforeEach(() => gravacao.mockClear());

describe('fallback offline (mock_db.json)', () => {
    test('fetchAll lê a coleção do arquivo', async () => {
        const categorias = await fetchAll('categorias');
        expect(categorias.map((c) => c.id)).toEqual(['cat1', 'cat2']);
    });

    test('fetchAll devolve lista vazia para coleção inexistente', async () => {
        expect(await fetchAll('nao-existe')).toEqual([]);
    });

    test('createItem gera um id e grava o item', async () => {
        const novo = await createItem('categorias', { nome: 'Acessórios' });

        expect(novo.id).toBeTruthy();
        expect(ultimoBancoGravado().categorias).toContainEqual(novo);
    });

    test('updateItem mescla os campos no item existente', async () => {
        const atualizado = await updateItem('categorias', 'cat2', { nome: 'Insumos Premium' });

        expect(atualizado).toEqual(expect.objectContaining({ id: 'cat2', nome: 'Insumos Premium', descricao: 'Ingredientes para produção' }));
    });

    test('updateItem falha para id inexistente', async () => {
        await expect(updateItem('categorias', 'nao-existe', { nome: 'x' })).rejects.toThrow();
        expect(gravacao).not.toHaveBeenCalled();
    });

    test('deleteItem remove o item e falha se ele não existir', async () => {
        await deleteItem('categorias', 'cat2');
        expect(ultimoBancoGravado().categorias.map((c) => c.id)).toEqual(['cat1']);

        await expect(deleteItem('categorias', 'nao-existe')).rejects.toThrow();
    });
});
