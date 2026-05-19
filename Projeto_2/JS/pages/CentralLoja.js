import { configurarHeader } from "../components/header.js";
import { montarCarrosselCotacoes } from "../components/CarrosselCotacoes.js";
import { getUsuarioLogado } from "../core/auth.js";
import { listarCotacoesPorLoja } from "../core/cotacoes.js";
import { getLojaDoUsuario } from "../core/loja.js";

document.addEventListener("DOMContentLoaded", async () => {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        alert("Você precisa estar logado para acessar o painel da loja");
        window.location.href = "Login.html";
        return;
    }

    if (usuario.tipoUsuario !== "Vendedor" && usuario.tipoUsuario !== "Admin") {
        alert("Você não tem permissão para acessar este painel");
        window.location.href = "PaginaPrincipal.html";
        return;
    }

    const loja = usuario.loja || await getLojaDoUsuario(usuario);

    if (!loja) {
        alert("Você não possui uma loja cadastrada");
        window.location.href = "CadastroLoja.html";
        return;
    }

    configurarHeader();
    montarCarrosselCotacoes("secao-cotacoes-loja");

    configurarCards();
    mostrarPainel("engajamento");

    await carregarEstatisticas(loja.id);

    const btnMinhaLoja = document.getElementById("MinhaLoja");

    if (btnMinhaLoja) {
        btnMinhaLoja.addEventListener("click", () => {
            window.location.href = `PaginaLoja.html?id=${loja.id}`;
        });
    }
});

async function carregarEstatisticas(lojaId) {
    try {
        const cotacoes = await listarCotacoesPorLoja(lojaId);

        atualizarTexto("stat-cotacoes", cotacoes.length);

        const respondidas = cotacoes.filter(c =>
            c.status !== "SOLICITADA"
        ).length;

        const taxa = cotacoes.length > 0
            ? Math.round((respondidas / cotacoes.length) * 100)
            : 0;

        atualizarTexto("stat-taxa", `${taxa}%`);

        const aprovadas = cotacoes.filter(c =>
            c.status === "APROVADA" ||
            c.status === "RESERVADA" ||
            c.status === "FINALIZADA"
        ).length;

        atualizarTexto("stat-aprovadas", aprovadas);

        const comPropostas = cotacoes.filter(c => Number(c.valorFinal) > 0);

        let ticket = 0;

        if (comPropostas.length > 0) {
            const total = comPropostas.reduce((acc, c) => acc + Number(c.valorFinal), 0);
            ticket = total / comPropostas.length;
        }

        atualizarTexto("stat-ticket", `R$ ${ticket.toFixed(2)}`);

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}

function configurarCards() {
    const cards = document.querySelectorAll(".card-aba");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const painel = card.dataset.painel;

            cards.forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");

            mostrarPainel(painel);
        });
    });
}

function mostrarPainel(nomePainel) {
    const conteudo = document.getElementById("conteudo-dinamico");
    const painelSelecionado = document.getElementById(`painel-${nomePainel}`);

    if (!conteudo || !painelSelecionado) return;

    conteudo.classList.remove("vazio");
    conteudo.innerHTML = "";

    const clone = painelSelecionado.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.remove("painel-conteudo");

    conteudo.appendChild(clone);
    conteudo.scrollTop = 0;
}

function atualizarTexto(id, valor) {
    const elementoOriginal = document.getElementById(id);
    const elementoClonado = document.querySelector(`#conteudo-dinamico #${id}`);

    if (elementoOriginal) {
        elementoOriginal.textContent = valor;
    }

    if (elementoClonado) {
        elementoClonado.textContent = valor;
    }
}