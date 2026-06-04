import { getUsuarioLogado } from "../core/auth.js";
import { listarCotacoesPorUsuario, listarCotacoesPorLoja, criarCardCotacao, chamarEstilizacao } from "../core/cotacoes.js";
import { getLojaDoUsuario } from "../core/loja.js";

function injetarEstilizacao() {
    if (document.getElementById("css-carrossel-cotacoes")) return;
    const link = document.createElement("link");
    link.id = "css-carrossel-cotacoes";
    link.rel = "stylesheet";
    link.href = "css/components/CarrosselCotacoes.css";
    document.head.appendChild(link);

    // CSS das cotações também
    chamarEstilizacao();
}

// ── Monta o HTML do carrossel num container existente ───

export function montarCarrosselCotacoes(containerId) {
    injetarEstilizacao();

    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container não encontrado: ${containerId}`);
        return;
    }

    const usuario = getUsuarioLogado();
    if (!usuario) {
        console.warn("Usuário não logado");
        return;
    }

    const ehLoja = usuario.tipoUsuario === "Vendedor";
    const titulo = ehLoja ? "Cotações recebidas" : "Minhas cotações";

    container.innerHTML = `
        <div class="carrossel-cotacoes-wrapper" id="carrossel-cotacoes-wrapper">
 
            <div class="carrossel-header" id="carrossel-header">
                <div class="carrossel-header-esq">
                    <span class="carrossel-titulo">${titulo}</span>
                    <span class="carrossel-badge" id="carrossel-badge">0</span>
                </div>
                <button class="carrossel-toggle" id="carrossel-toggle" aria-label="Minimizar">
                    <span id="carrossel-toggle-icone">▾</span>
                </button>
            </div>
 
            <div class="carrossel-body" id="carrossel-body">
                <div class="cotacoes-wrapper">
                    <button class="scroll-btn left"  id="scroll-left-cotacoes">‹</button>
                    <div class="lista-cotacoes" id="lista-cotacoes-componente"></div>
                    <button class="scroll-btn right" id="scroll-right-cotacoes">›</button>
                </div>
            </div>
 
        </div>
    `;

    // Toggle collapse
    const body = container.querySelector("#carrossel-body");
    const toggle = container.querySelector("#carrossel-toggle");
    const icone = container.querySelector("#carrossel-toggle-icone");
    let aberto = true;

    toggle.addEventListener("click", () => {
        aberto = !aberto;
        body.classList.toggle("fechado", !aberto);
        icone.textContent = aberto ? "▾" : "▸";
        toggle.setAttribute("aria-label", aberto ? "Minimizar" : "Expandir");
    });

    // Scroll
    const lista = container.querySelector("#lista-cotacoes-componente");
    const btnLeft = container.querySelector("#scroll-left-cotacoes");
    const btnRight = container.querySelector("#scroll-right-cotacoes");
    const scrollAmount = 5 * 260;

    btnRight.addEventListener("click", () => lista.scrollBy({ left: scrollAmount, behavior: "smooth" }));
    btnLeft.addEventListener("click", () => lista.scrollBy({ left: -scrollAmount, behavior: "smooth" }));

    // Carrega cotações
    carregarCotacoes(container, usuario, ehLoja);

    async function carregarCotacoes(container, usuario, ehLoja) {
        const lista = container.querySelector("#lista-cotacoes-componente");
        const badge = container.querySelector("#carrossel-badge");

        lista.innerHTML = `<p class="cotacoes-loading">Carregando...</p>`;

        try {
            let cotacoes = [];

            if (ehLoja) {
                // Loja: busca as cotações que chegaram pra ela
                const loja = await getLojaDoUsuario(usuario);
                if (!loja) {
                    lista.innerHTML = `<p class="cotacoes-vazio">Nenhuma loja cadastrada.</p>`;
                    badge.textContent = "0";
                    return;
                }
                cotacoes = await listarCotacoesPorLoja(loja.id);
            } else {
                // Cliente: busca suas próprias cotações
                cotacoes = await listarCotacoesPorUsuario(usuario.id);
            }

            badge.textContent = cotacoes.length;

            if (cotacoes.length === 0) {
                lista.innerHTML = `<p class="cotacoes-vazio">${ehLoja ? "Nenhuma cotação recebida." : "Nenhuma cotação enviada."}</p>`;
                return;
            }

            lista.innerHTML = "";

            cotacoes.forEach(cotacao => {
                // callback atualiza o card quando status muda no modal
                const card = criarCardCotacao(cotacao, (cotacaoAtualizada) => {
                    // Recarrega a lista inteira quando status muda
                    carregarCotacoes(container, usuario, ehLoja);
                });
                lista.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao carregar cotações:", error);
            lista.innerHTML = `<p class="cotacoes-vazio">Erro ao carregar cotações.</p>`;
        }
    }
}