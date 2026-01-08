


// Tenta buscar o usuário salvo no navegador
function obterUsuarioLogado() {

    // Pega o valor salvo com a chave "usuarioLogado"
    const usuarioString = localStorage.getItem("usuarioLogado");

    // Se não existir nada salvo, retorna null
    if (!usuarioString) {
        return null;
    }

    // Converte de texto (JSON) para objeto JS
    return JSON.parse(usuarioString);
}

function esconderTodosOsBlocos() {

    // Visitante
    document.getElementById("menu-visitante").style.display = "none";

    // Usuário logado
    document.getElementById("menu-usuario").style.display = "none";

    // Tipos
    document.getElementById("menu-carrinho").style.display = "none";
    document.getElementById("menu-vendedor").style.display = "none";
    document.getElementById("menu-admin").style.display = "none";

    // Seções
    document.getElementById("secao-cotacoes").style.display = "none";
    document.getElementById("secao-admin").style.display = "none";
}


function configurarTela() {

    // Primeiro, escondemos tudo
    esconderTodosOsBlocos();

    // Tentamos descobrir se tem alguém logado
    const usuario = obterUsuarioLogado();

    // 👉 CASO 1: ninguém logado
    if (usuario === null) {
        document.getElementById("menu-visitante").style.display = "block";
        return;
    }

    // 👉 CASO 2: alguém logado
    document.getElementById("menu-usuario").style.display = "block";

    // Agora decide pelo tipo
    if (usuario.tipo === "CLIENTE") {

        document.getElementById("menu-carrinho").style.display = "block";
        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipo === "VENDEDOR") {

        document.getElementById("menu-vendedor").style.display = "block";
        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipo === "ADMIN") {

        document.getElementById("menu-admin").style.display = "block";
        document.getElementById("secao-admin").style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    configurarTela();
});

function simularLogin(tipo) {

    const usuarioFake = {
        nome: "Usuário Teste",
        email: "teste@email.com",
        tipo: tipo // CLIENTE | VENDEDOR | ADMIN
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioFake));

    configurarTela();
}





