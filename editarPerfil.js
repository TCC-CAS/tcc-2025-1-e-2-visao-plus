document.addEventListener("DOMContentLoaded", () => {

    // ===== ELEMENTOS DO DOM =====
    const modalPerfil = document.getElementById("modal-editar-perfil");
    const botaoEditarPerfil = document.getElementById("editar-perfil");
    const botaoFecharPerfil = document.getElementById("fechar-modal-perfil");

    // ===== EVENTOS =====

    // abrir
    botaoEditarPerfil.addEventListener("click", () => {
        preencherFormularioPerfil();
        modalPerfil.classList.remove("hidden");
    });

    // fechar pelo X
    botaoFecharPerfil.addEventListener("click", () => {
        modalPerfil.classList.add("hidden");
    });

    // fechar clicando fora da caixa
    modalPerfil.addEventListener("click", (e) => {
        if (e.target === modalPerfil) {
            modalPerfil.classList.add("hidden");
        }
    });

    // SALVAR PERFIL
    formEditarPerfil.addEventListener("submit", salvarPerfil);
});

// ===== FUNÇÕES DE UI =====

// Função para obter o usuário logado do localStorage
function obterUsuarioLogado() {
    const usuarioJSON = localStorage.getItem("usuarioLogado");
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

// ===== FUNÇÕES DE DADOS =====

// Preencher o formulário com os dados do usuário
function preencherFormularioPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    document.getElementById("edit-nome-usuario").value = usuario.nome;
    document.getElementById("edit-email-usuario").value = usuario.email;
}

function montarDtoUsuario() {
    const usuario = obterUsuarioLogado();

    return {
        id: usuario.id,
        nome: document.getElementById("edit-nome-usuario").value,
        email: document.getElementById("edit-email-usuario").value,
        senha: document.getElementById("edit-senha-usuario").value
    };
}

// ===== FLUXO PRINCIPAL =====

async function salvarPerfil(e) {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    const dadosUsuario = {
        id: usuario.id,
        nome: document.getElementById("edit-nome-usuario").value,
        email: document.getElementById("edit-email-usuario").value,
        senha: document.getElementById("edit-senha-usuario").value
    };

    console.log("DTO Perfil:", dadosUsuario);

    const usuarioAtualizado = await editarDadosUsuario(dadosUsuario);

    if (usuarioAtualizado) {
        dadosUsuario = usuarioAtualizado;
        // Atualiza o localStorage com os novos dados do usuário
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
        alert("Perfil atualizado com sucesso!");
        document.getElementById("modal-editar-perfil").classList.add("hidden");
    } else {
        alert("Erro ao atualizar perfil. Tente novamente.");
    }
}

// ===== API =====

async function editarDadosUsuario(dadosUsuario) {
    try {
        const response = await fetch("http://localhost:8080/usuarios/editarUsuario", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });
        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        return null;
    }
}

// ===== LOCAL STORAGE =====

function atualizarLojaNoLocalStorage(usuarioAtualizado) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
}