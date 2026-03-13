// js/core/api.js

export const API = "http://localhost:8080";

/**
 * Fetch padrão da aplicação
 */
export async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        let mensagem = "Erro na requisição";

        try {
            mensagem = await response.text();
        } catch (e) {}

        throw new Error(mensagem);
    }

    // tenta converter pra JSON, senão retorna texto
    try {
        return await response.json();
    } catch {
        return null;
    }
}
