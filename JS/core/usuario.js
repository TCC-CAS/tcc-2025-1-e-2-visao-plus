// js/core/usuario.js
import { apiFetch , API } from "./api.js";
import { getUsuarioLogado, setUsuarioLogado } from "./auth.js";

export async function editarDadosUsuario(dadosUsuario) {
    try {
        const response = await fetch(`${API}/usuarios/editarUsuario`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });
        if (!response.ok) return null;
        const usuarioAtualizado = await response.json();
        setUsuarioLogado(usuarioAtualizado);
        return usuarioAtualizado;
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        return null;
    }
}

export async function listarUsuarios() {
    try {
        const response = await fetch(`${API}/usuarios/listarUsuarios`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return [];
    }
}

export async function deletarUsuario(id) {
    const confirmacao = confirm("Tem certeza que deseja deletar este usuário?");
    if (!confirmacao) return;

    const response = await fetch(
        `${API}/usuarios/deletarUsuario/${id}`,
        { method: "DELETE" }
    );

    if (response.ok) {
        alert("Usuário deletado!");
        carregarUsuarios();
    } else {
        alert("Erro ao deletar usuário");
    }
}