import { configurarHeader } from "../components/header.js";
import { buscarLojaPorId } from "../core/loja.js";
import { getUsuarioLogado } from "../core/auth.js";
import { listarArmacoesPorLoja } from "../core/produtos.js";
import { listarLentesPorLoja } from "../core/produtos.js";

function getIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function carregarLoja() {
  try {
    const id = getIdDaUrl();

    if (!id) {
      alert("Loja não encontrada");
      return;
    }

    const loja = await buscarLojaPorId(id);

    document.getElementById("loja-nome").textContent = loja.nome;
    document.getElementById("loja-email").textContent = loja.email;
    document.getElementById("loja-endereco").textContent = loja.endereco;

  } catch (e) {
    console.error(e);
    alert("Erro ao carregar loja");
  }
}

async function carregarProdutos() {
  try {
    const id = getIdDaUrl();

    if (!id) {
      alert("Loja não encontrada");
      return;
    }

    const lentes = await listarLentesPorLoja(id);
    const armacoes = await listarArmacoesPorLoja(id);

    renderizarProdutos(lentes, armacoes);
  } catch (e) {
    console.error(e);
    alert("Erro ao carregar produtos");
  }
}

async function renderizarProdutos(lentes, armacoes) {
  const containerLentes = document.getElementById("lista-lentes");
  const containerArmacoes = document.getElementById("lista-armacoes");

  containerLentes.innerHTML = "";
  containerArmacoes.innerHTML = "";

  if (lentes.length === 0) {
    containerLentes.innerHTML = "<p>Nenhuma lente cadastrada.</p>";
  } else {
    lentes.forEach(lente => {
      const card = criarCardLente(lente);
      containerLentes.appendChild(card);
    });
  }

  if (armacoes.length === 0) {
    containerArmacoes.innerHTML = "<p>Nenhuma armação cadastrada.</p>";
  } else {
    armacoes.forEach(armacao => {
      const card = criarCardArmacao(armacao);
      containerArmacoes.appendChild(card);
    });
  }
}

function criarCardLente(lente) {
  const div = document.createElement("div");
  div.classList.add("card-produto");

  div.innerHTML = `
    <h3>${lente.nome}</h3>
    <p><strong>Preço:</strong> R$ ${lente.preco.toFixed(2)}</p>
    <p><strong>Descrição:</strong> ${lente.descricao}</p>
  `;

  div.addEventListener("click", () => {
    selecionarLente(lente);
  }); 

  return div;
}

function criarCardArmacao(armacao) {
  const div = document.createElement("div");
  div.classList.add("card-produto");
  div.innerHTML = `
    <h3>${armacao.nome}</h3>
    <p><strong>Preço:</strong> R$ ${armacao.preco.toFixed(2)}</p>
    <p><strong>Descrição:</strong> ${armacao.descricao}</p>
  `;

  div.addEventListener("click", () => {
    selecionarArmacao(armacao);
  });

  return div;
}

let lenteSelecionada = null;
let armacaoSelecionada = null;

function selecionarLente(lente) {
  lenteSelecionada = lente;
  console.log("Lente escolhida:", lente);
}

function selecionarArmacao(armacao) {
  armacaoSelecionada = armacao;
  console.log("Armação escolhida:", armacao);
}

document.addEventListener("DOMContentLoaded", () => {
  configurarHeader();
  carregarLoja();
  carregarProdutos();
});