import { API } from "./api.js"; // API = "http://localhost:8080"

export async function criarCotacao(dadosCotacao) {
    const response = await fetch(`${API}/cotacoes/criarCotacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCotacao),
    });

    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return response.json();
}