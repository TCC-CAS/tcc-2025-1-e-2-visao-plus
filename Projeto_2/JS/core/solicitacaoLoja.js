const API_BASE = "https://tccvisionplus-production.up.railway.app";

export async function buscarSolicitacaoLojaPorUsuario(idUsuario) {
    try {
        const resposta = await fetch(`${API_BASE}/solicitacoes-loja/usuario/${idUsuario}`);

        if (resposta.status === 204) {
            return null;
        }

        if (!resposta.ok) {
            throw new Error("Erro ao buscar solicitação de loja do usuário");
        }

        return await resposta.json();

    } catch (erro) {
        console.error("Erro ao buscar solicitação de loja:", erro);
        return null;
    }
}