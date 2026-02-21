import { apiFetch, API } from "./api";
import { listarLentePorId, listarArmacaoPorId } from "./produtos";
import {getUsuarioLogado} from "./auth";
import {getLojaDoUsuario} from "./loja";

export async function criarCotacao(dadosCotacao) {

    try {
        const responde = await fetch(`${API}/cotacoes/criarCotacao`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosCotacao),
        });

        if (!responde.ok) {
            throw new Error(`Erro na requisição: ${responde.status}`);
        }

        const data = await responde.json();
        return data;
    } catch (error) {
        console.error("Erro ao criar cotação:", error);
        throw error;
    }
}