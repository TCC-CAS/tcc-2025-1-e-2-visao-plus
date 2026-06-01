import { API } from "./api.js";

// Envia proposta (loja) — endpoint específico com valor + prazo
export async function enviarProposta(idCotacao, idLoja, valorFinal, prazoEntrega, observacaoLoja) {
    const response = await fetch(`${API}/cotacoes/${idCotacao}/responder?idLoja=${idLoja}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valorFinal,
            prazoEntrega,
            observacaoLoja
        })
    });

    if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || "Erro ao enviar proposta.");
    }

    return response.json();
}

// Todas as outras transições — endpoint central
export async function transicionarStatus(idCotacao, novoStatus, idAtor) {
    const response = await fetch(`${API}/cotacoes/${idCotacao}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novoStatus, idAtor })
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}