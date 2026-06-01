  import { configurarHeader } from "../components/header.js";
  import { buscarLojaPorId } from "../core/loja.js";
  import { listarArmacoesPorLoja, listarLentesPorLoja } from "../core/produtos.js";
  import { adicionarProdutoCotacao } from "../components/modalCotacao.js";
  import { getUsuarioLogado } from "../core/auth.js";
  import { montarVitrineLoja } from "../components/VitrineLoja.js";

  /* =========================
    CONFIGURAÇÕES
  ========================= */

  const API = "http://localhost:8080";

  const state = {
      loja: null,
      lentes: [],
      armacoes: [],
      configuracao: {
          bannerUrl: "",
          textoDestaque: "",
          mostrarBanner: false,

          fontePrimaria: "Arial",
          fonteSecundaria: "Helvetica",

          corPrimaria: "#156783",
          corSecundaria: "#b5d7df",
          corFundo: "#f5f7fa",

          layoutPagina: "padrao",
          layoutProdutos: "grid",

          mostrarPreco: true,
          mostrarMarca: true,
          produtosLinha: 4
      }
  };

  /* =========================
    ELEMENTOS
  ========================= */

  const msgPaginaLoja = document.getElementById("msgPaginaLoja");
  const btnCotacaoFlutuante = document.getElementById("btn-cotacao");

  /* =========================
    INICIALIZAÇÃO
  ========================= */

  document.addEventListener("DOMContentLoaded", async () => {
      try {
          configurarHeader();

          fecharModalProdutoAoIniciar();
          configurarEventoFecharModalProduto();

          await carregarVitrineCompleta();

      } catch (error) {
          console.error("Erro ao inicializar página da loja:", error);
          mostrarMensagem(msgPaginaLoja, "Erro ao carregar página da loja.", "erro");
      }
  });

  /* =========================
    CARREGAMENTO PRINCIPAL
  ========================= */

  async function carregarVitrineCompleta() {
      const idLoja = getIdDaUrl();

      if (!idLoja) {
          mostrarMensagem(msgPaginaLoja, "Loja não encontrada.", "erro");
          return;
      }

      const [loja, configuracao, lentes, armacoes] = await Promise.all([
          buscarLojaPorId(idLoja),
          buscarConfiguracaoLoja(idLoja),
          listarLentesPorLoja(idLoja),
          listarArmacoesPorLoja(idLoja)
      ]);

      state.loja = loja;
      state.configuracao = {
          ...state.configuracao,
          ...configuracao
      };
      state.lentes = lentes || [];
      state.armacoes = armacoes || [];

      await montarVitrineLoja({
          containerId: "vitrineLoja",
          loja: state.loja,
          configuracao: state.configuracao,
          lentes: state.lentes,
          armacoes: state.armacoes,
          modo: "publico",
          permitirCotacao: usuarioPodeSolicitarCotacao(),

          onCotarProduto: (produto, tipo) => {
              if (!validarPermissaoCotacao()) return;

              adicionarProdutoCotacao(produto, tipo);
          },

          onAbrirProduto: (produto, tipo) => {
              abrirModalProduto(produto, tipo);
          }
      });

      controlarBotaoCotacaoFlutuante();
  }

  /* =========================
    BUSCAS
  ========================= */

  async function buscarConfiguracaoLoja(lojaId) {
      const response = await fetch(`${API}/configuracao/buscar/${lojaId}`);

      if (!response.ok) {
          throw new Error("Erro ao buscar configuração da loja");
      }

      return await response.json();
  }

  function getIdDaUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
  }

  /* =========================
    PERMISSÕES
  ========================= */

  function usuarioPodeSolicitarCotacao() {
      const usuario = getUsuarioLogado();

      return usuario && usuario.tipoUsuario === "Comum";
  }

  function validarPermissaoCotacao() {
      if (usuarioPodeSolicitarCotacao()) {
          return true;
      }

      const usuario = getUsuarioLogado();

      if (!usuario) {
          mostrarMensagem(
              msgPaginaLoja,
              "Você precisa estar logado como consumidor para solicitar cotação.",
              "erro"
          );

          setTimeout(() => {
              window.location.href = "Login.html";
          }, 1800);

          return false;
      }

      mostrarMensagem(
          msgPaginaLoja,
          "Usuários de loja não podem solicitar cotações. Use a central da loja para responder clientes.",
          "erro"
      );

      return false;
  }

  function controlarBotaoCotacaoFlutuante() {
      if (!btnCotacaoFlutuante) return;

      if (usuarioPodeSolicitarCotacao()) {
          btnCotacaoFlutuante.classList.remove("cotacao-bloqueada");
      } else {
          btnCotacaoFlutuante.classList.add("cotacao-bloqueada");
      }
  }

  /* =========================
    REGRAS VISUAIS DA CONFIGURAÇÃO
  ========================= */

  function deveMostrarPreco() {
      return state.configuracao?.mostrarPreco !== false;
  }

  function deveMostrarMarca() {
      return state.configuracao?.mostrarMarca !== false;
  }

  /* =========================
    MODAL DE PRODUTO
  ========================= */

  function abrirModalProduto(produto, tipo) {
      const modal = document.getElementById("modal-produto");

      if (!modal || !produto) return;

      document.getElementById("produto-nome").textContent = produto.nome || "Produto";
      document.getElementById("produto-tipo").textContent = formatarTipoProduto(tipo);

      const produtoMarca = document.getElementById("produto-marca");
      if (produtoMarca) {
          produtoMarca.textContent = deveMostrarMarca()
              ? produto.marca || "Não informada"
              : "Oculta pela loja";
      }

      document.getElementById("produto-modelo").textContent = produto.modelo || "Não informado";
      document.getElementById("produto-material").textContent = produto.material || "Não informado";
      document.getElementById("produto-descricao").textContent = produto.descricao || "Sem descrição.";

      const produtoPreco = document.getElementById("produto-preco");

      if (produtoPreco) {
          if (deveMostrarPreco()) {
              produtoPreco.textContent = `R$ ${Number(produto.preco || 0).toFixed(2).replace(".", ",")}`;
              produtoPreco.classList.remove("preco-consulta-modal");
          } else {
              produtoPreco.textContent = "Preço sob consulta";
              produtoPreco.classList.add("preco-consulta-modal");
          }
      }

      const img = document.getElementById("produto-imagem");

      if (img) {
          img.src = produto.fotoUrl || "imgs/store1.png";
          img.alt = produto.nome || "Produto";
      }

      configurarBotaoAdicionarCotacaoProduto(produto, tipo, modal);

      modal.classList.add("ativo");
  }

  function configurarBotaoAdicionarCotacaoProduto(produto, tipo, modal) {
      const btnAntigo = document.getElementById("btn-adicionar-cotacao");

      if (!btnAntigo) return;

      const novoBtn = btnAntigo.cloneNode(true);
      btnAntigo.replaceWith(novoBtn);

      if (!usuarioPodeSolicitarCotacao()) {
          novoBtn.classList.add("cotacao-bloqueada");
      } else {
          novoBtn.classList.remove("cotacao-bloqueada");
      }

      novoBtn.addEventListener("click", () => {
          if (!validarPermissaoCotacao()) return;

          adicionarProdutoCotacao(produto, tipo);
          modal.classList.remove("ativo");
      });
  }

  function configurarEventoFecharModalProduto() {
      const btnFechar = document.getElementById("fechar-modal-produto");

      btnFechar?.addEventListener("click", () => {
          document.getElementById("modal-produto")?.classList.remove("ativo");
      });

      const modal = document.getElementById("modal-produto");

      modal?.addEventListener("click", (event) => {
          if (event.target === modal) {
              modal.classList.remove("ativo");
          }
      });
  }

  function fecharModalProdutoAoIniciar() {
      document.getElementById("modal-produto")?.classList.remove("ativo");
  }

  function formatarTipoProduto(tipo) {
      if (tipo === "lente") return "Lente";
      if (tipo === "armacao") return "Armação";

      return tipo || "Produto";
  }

  /* =========================
    MENSAGENS
  ========================= */

  function mostrarMensagem(elemento, texto, tipo) {
      if (!elemento) {
          alert(texto);
          return;
      }

      elemento.textContent = texto;
      elemento.classList.remove("sucesso", "erro");
      elemento.classList.add("mostrar", tipo);

      setTimeout(() => {
          elemento.classList.remove("mostrar");
      }, 4000);
  }