import { apiGetAll } from './api';

//busca no backend e guarda uma cópia; se o backend falhar, devolve a última cópia salva
export const buscarComCache = async (entidade) => {
  const chave = `cevada_${entidade}`;

  try {
    const response = await apiGetAll(entidade);
    if (!response.success) throw new Error(response.message);

    localStorage.setItem(chave, JSON.stringify(response.data));
    return { dados: response.data, doCache: false };
  } catch (error) {
    console.warn(`[cache] usando ${entidade} do localStorage:`, error.message);
    const salvo = localStorage.getItem(chave);
    return { dados: salvo ? JSON.parse(salvo) : [], doCache: true };
  }
};
