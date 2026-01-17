document.addEventListener("DOMContentLoaded", () => {

    // ===== ELEMENTOS DO DOM =====
    const modalLoja = document.getElementById("modal-editar-loja");
    const botaoEditarLoja = document.getElementById("editar-loja");

    if (!botaoEditarLoja) return; // usuário pode não ter loja

    const botaoFecharLoja = modalLoja.querySelector(".fechar-modal");
    const formEditarLoja = document.getElementById("form-editar-loja");

    // ===== EVENTOS =====

    // Abrir modal
    botaoEditarLoja.addEventListener("click", () => {
        preencherFormularioLoja();
        modalLoja.classList.remove("hidden");
    });

    // Fechar modal pelo X
    botaoFecharLoja.addEventListener("click", () => {
        fecharModalLoja();
    });

    // Fechar clicando fora
    modalLoja.addEventListener("click", (e) => {
        if (e.target === modalLoja) {
            fecharModalLoja();
        }
    });

    // Salvar loja
    formEditarLoja.addEventListener("submit", salvarLoja);
});


// ===== FUNÇÕES DE UI =====

function fecharModalLoja() {
    document.getElementById("modal-editar-loja").classList.add("hidden");
}


// ===== FUNÇÕES DE DADOS =====

// Preenche o formulário com os dados atuais da loja
function preencherFormularioLoja() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario || !usuario.loja) return;

    document.getElementById("edit-nome-loja").value = usuario.loja.nome;
    document.getElementById("edit-email-loja").value = usuario.loja.email;
    document.getElementById("edit-cnpj-loja").value = usuario.loja.cnpj;
    document.getElementById("edit-cep-loja").value = usuario.loja.cep;
    document.getElementById("edit-endereco-loja").value = usuario.loja.endereco;
}


// Extrai os dados do formulário e monta o DTO
function montarDtoLoja() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    return {
        id: usuario.loja.id,
        nome: document.getElementById("edit-nome-loja").value,
        email: document.getElementById("edit-email-loja").value,
        cnpj: document.getElementById("edit-cnpj-loja").value,
        cep: document.getElementById("edit-cep-loja").value,
        endereco: document.getElementById("edit-endereco-loja").value
    };
}


// ===== FLUXO PRINCIPAL =====

async function salvarLoja(e) {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    const dadosLoja = {
        id: usuario.loja.id,
        nome: document.getElementById("edit-nome-loja").value,
        email: document.getElementById("edit-email-loja").value,
        cnpj: document.getElementById("edit-cnpj-loja").value,
        cep: document.getElementById("edit-cep-loja").value,
        endereco: document.getElementById("edit-endereco-loja").value
    };

    console.log("DTO Loja:", dadosLoja);

    const lojaAtualizada = await editarDadosLoja(dadosLoja);

    if (lojaAtualizada) {
        usuario.loja = lojaAtualizada;
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert("Loja atualizada com sucesso!");
        document.getElementById("modal-editar-loja").classList.add("hidden");
    } else {
        alert("Erro ao atualizar loja");
    }
}


// ===== API =====

async function editarDadosLoja(dadosLoja) {
    try {
        const response = await fetch("http://localhost:8080/lojas/editarLoja", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosLoja)
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error("Erro ao editar loja:", error);
        return null;
    }
}


// ===== LOCAL STORAGE =====

function atualizarLojaNoLocalStorage(lojaAtualizada) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    usuario.loja = lojaAtualizada;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}


// FIM - funcionando editarLoja.js