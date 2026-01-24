const API = "http://localhost:8080/"; // ajusta se precisar

document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

function initPaginaAdmin() {
    setNomeLoja(Nomeloja); // depois você pode buscar isso do backend
    carregarArmacoes();
    carregarLentes();
    configurarEventos();
}

async function setNomeLoja() {
    try {
        const response = await fetch(`${API}/lojas/buscarLoja`);
        if (!response.ok) throw new Error("Erro ao buscar loja");

        const loja = await response.json();
        const Nomeloja = loja.nome;
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lojas");
    }
}

async function carregarArmacoes() {
    try {
        const response = await fetch(`${API}/armacoes/listarArmacoes`);
        if (!response.ok) throw new Error("Erro ao buscar armações");

        const armacoes = await response.json();
        renderizarArmacoes(armacoes);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar armações");
    }
}