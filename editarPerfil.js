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

    const dadosAtualizados = {
        id: usuario.id,
        nome: document.getElementById("edit-nome-usuario").value,
        email: document.getElementById("edit-email-usuario").value,
        senha: document.getElementById("edit-senha-usuario").value
    };

    console.log("Salvar perfil:", dadosAtualizados);

}


