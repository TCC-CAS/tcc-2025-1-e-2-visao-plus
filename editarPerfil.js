document.addEventListener("DOMContentLoaded", () => {

    const modalPerfil = document.getElementById("modal-editar-perfil");
    const botaoEditarPerfil = document.getElementById("editar-perfil");
    const botaoFecharPerfil = document.getElementById("fechar-modal-perfil");

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
    document.getElementById("form-editar-perfil")
        .addEventListener("submit", salvarPerfil);
});

// Função para obter o usuário logado do localStorage
function obterUsuarioLogado() {
    const usuarioJSON = localStorage.getItem("usuarioLogado");
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

// Preencher o formulário com os dados do usuário
function preencherFormularioPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    document.getElementById("edit-nome-usuario").value = usuario.nome;
    document.getElementById("edit-email-usuario").value = usuario.email;
}

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


