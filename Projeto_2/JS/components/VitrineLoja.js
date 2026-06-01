import { montarSecaoCupons } from "./CuponsWidget.js";

const CSS_VITRINE_ID = "vitrine-loja-css";
const CSS_VITRINE_PATH = "css/components/VitrineLoja.css";

export function carregarCssVitrineLoja() {
    if (document.getElementById(CSS_VITRINE_ID)) return;

    const link = document.createElement("link");
    link.id = CSS_VITRINE_ID;
    link.rel = "stylesheet";
    link.href = CSS_VITRINE_PATH;

    document.head.appendChild(link);
}

function normalizarLayoutProdutos(valor) {
    if (valor === "horizontal") return "carrossel";
    if (valor === "carousel") return "carrossel";
    if (valor === "grid") return "grid";
    if (valor === "lista") return "lista";

    return "carrossel";
}

function corTextoContraste(hex) {
    if (!hex) return "#111827";

    hex = hex.replace("#", "");

    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brilho = (r * 299 + g * 587 + b * 114) / 1000;

    return brilho > 150 ? "#2b1d1d" : "#ffffff";
}

export async function montarVitrineLoja({
    containerId,
    loja,
    configuracao = {},
    lentes = [],
    armacoes = [],
    modo = "publico",
    permitirCotacao = true,
    onCotarProduto = null,
    onAbrirProduto = null
}) {
    const container = document.getElementById(containerId);

    if (!container || !loja) return;

    carregarCssVitrineLoja();

    const plano = obterPlanoLoja(loja);
    const layoutProdutos = normalizarLayoutProdutos(configuracao?.layoutProdutos);
    aplicarVariaveisTema(container, configuracao, plano);

    container.className = [
        "vp-vitrine-loja",
        `plano-${plano.toLowerCase()}`,
        `layout-${configuracao?.layoutPagina || "padrao"}`,
        `produtos-${layoutProdutos}`,
        `modo-${modo}`
    ].join(" ");

    container.innerHTML = criarHtmlBaseVitrine(containerId);

    preencherHero(container, loja, configuracao, plano);

    renderizarProdutosVitrine({
        root: container,
        lentes,
        armacoes,
        configuracao,
        permitirCotacao,
        onCotarProduto,
        onAbrirProduto
    });

    if (layoutProdutos === "carrossel") {
        configurarCarrosseis(container);
    }

    await montarSecaoCupons({
        containerId: `${containerId}-cupons`,
        modo: "loja",
        idLoja: loja.id,
        titulo: "Cupons desta loja",
        subtitulo: "Resgate descontos exclusivos antes de solicitar sua cotação."
    });
}

function criarHtmlBaseVitrine(containerId) {
    return `
        <section class="vp-vitrine-hero">
            <div class="vp-vitrine-hero-overlay">
                <div class="vp-vitrine-foto-wrapper">
                    <img class="vp-vitrine-foto" data-vitrine-logo src="imgs/store1.png" alt="Foto da loja">
                </div>

                <div class="vp-vitrine-dados">
                    <span class="vp-vitrine-plano" data-vitrine-plano></span>
                    <h1 data-vitrine-nome></h1>
                    <p class="vp-vitrine-destaque" data-vitrine-destaque></p>

                    <div class="vp-vitrine-contatos">
                        <p data-vitrine-email></p>
                        <p data-vitrine-endereco></p>
                    </div>
                </div>
            </div>
        </section>

        <section class="vp-vitrine-conteudo">
            <div class="vp-vitrine-titulo">
                <h2>Produtos</h2>
                <p>Conheça os produtos disponíveis nesta loja.</p>
            </div>

            <section class="vp-vitrine-grid">
                <div class="vp-vitrine-produtos">
                    ${criarSecaoProduto("Lentes", "lentes")}
                    ${criarSecaoProduto("Armações", "armacoes")}
                </div>

                <aside class="vp-vitrine-cupons">
                    <div id="${containerId}-cupons"></div>
                </aside>
            </section>
        </section>
    `;
}

function criarSecaoProduto(titulo, chave) {
    return `
        <section class="vp-secao-produtos" data-carrossel="${chave}">
            <div class="vp-secao-produtos-topo">
                <h3>${titulo}</h3>

                <div class="vp-carrossel-controles">
                    <button type="button" class="vp-carrossel-btn" data-carrossel-prev="${chave}" aria-label="Produtos anteriores">‹</button>
                    <button type="button" class="vp-carrossel-btn" data-carrossel-next="${chave}" aria-label="Próximos produtos">›</button>
                </div>
            </div>

            <div class="vp-carrossel-janela">
                <div class="vp-lista-produtos" data-lista-${chave}></div>
            </div>
        </section>
    `;
}

function preencherHero(root, loja, config, plano) {
    const hero = root.querySelector(".vp-vitrine-hero");

    const podeMostrarBanner =
        (plano === "PLUS" || plano === "PRO") &&
        config?.mostrarBanner &&
        config?.bannerUrl;

    if (podeMostrarBanner) {
        hero.style.backgroundImage = `url('${config.bannerUrl}')`;
        hero.classList.add("com-banner");
    } else {
        hero.style.backgroundImage = "none";
        hero.classList.remove("com-banner");
    }

    setSrc(root, "[data-vitrine-logo]", loja.fotoUrl || "imgs/store1.png");
    setTexto(root, "[data-vitrine-nome]", loja.nome || "Loja");
    setTexto(root, "[data-vitrine-email]", loja.email || "");
    setTexto(root, "[data-vitrine-endereco]", loja.endereco || "");
    setTexto(root, "[data-vitrine-plano]", `Plano ${plano}`);

    const destaque = root.querySelector("[data-vitrine-destaque]");
    const podeMostrarDestaque =
        plano === "PRO" &&
        config?.textoDestaque &&
        config.textoDestaque.trim() !== "";

    if (destaque) {
        destaque.textContent = podeMostrarDestaque ? config.textoDestaque : "";
        destaque.style.display = podeMostrarDestaque ? "block" : "none";
    }
}

function renderizarProdutosVitrine({
    root,
    lentes,
    armacoes,
    configuracao,
    permitirCotacao,
    onCotarProduto,
    onAbrirProduto
}) {
    renderizarListaProdutos({
        container: root.querySelector("[data-lista-lentes]"),
        produtos: lentes,
        tipo: "lente",
        configuracao,
        permitirCotacao,
        onCotarProduto,
        onAbrirProduto
    });

    renderizarListaProdutos({
        container: root.querySelector("[data-lista-armacoes]"),
        produtos: armacoes,
        tipo: "armacao",
        configuracao,
        permitirCotacao,
        onCotarProduto,
        onAbrirProduto
    });
}

function renderizarListaProdutos({
    container,
    produtos,
    tipo,
    configuracao,
    permitirCotacao,
    onCotarProduto,
    onAbrirProduto
}) {
    if (!container) return;

    container.innerHTML = "";

    if (!produtos || produtos.length === 0) {
        container.innerHTML = `<p class="vp-vazio-produtos">Nenhum produto cadastrado.</p>`;
        return;
    }

    produtos.forEach(produto => {
        container.appendChild(criarCardProduto({
            produto,
            tipo,
            configuracao,
            permitirCotacao,
            onCotarProduto,
            onAbrirProduto
        }));
    });
}

function criarCardProduto({
    produto,
    tipo,
    configuracao,
    permitirCotacao,
    onCotarProduto,
    onAbrirProduto
}) {
    const card = document.createElement("article");
    card.className = "vp-card-produto";

    const mostrarMarca = configuracao?.mostrarMarca !== false;
    const mostrarPreco = configuracao?.mostrarPreco !== false;

    card.innerHTML = `
        <div class="vp-produto-img">
            <img src="${produto.fotoUrl || "imgs/store1.png"}" alt="${produto.nome || "Produto"}">
        </div>

        <div class="vp-produto-info">
            <h4>${produto.nome || "Produto"}</h4>

            ${mostrarMarca ? `<p><strong>Marca:</strong> ${produto.marca || "Não informada"}</p>` : ""}

            ${mostrarPreco
            ? `<p class="vp-preco-produto"><strong>Preço:</strong> R$ ${formatarPreco(produto.preco)}</p>`
            : `<p class="vp-preco-consulta">Preço sob consulta</p>`
        }

            <p><strong>Descrição:</strong> ${produto.descricao || ""}</p>
        </div>

        ${permitirCotacao ? `<button type="button" class="vp-btn-cotar">+ Cotar</button>` : ""}
    `;

    card.addEventListener("click", () => {
        if (typeof onAbrirProduto === "function") {
            onAbrirProduto(produto, tipo);
        }
    });

    const btnCotar = card.querySelector(".vp-btn-cotar");

    btnCotar?.addEventListener("click", (event) => {
        event.stopPropagation();

        if (typeof onCotarProduto === "function") {
            onCotarProduto(produto, tipo);
        }
    });

    return card;
}

function configurarCarrosseis(root) {
    const carrosseis = root.querySelectorAll("[data-carrossel]");

    carrosseis.forEach(secao => {
        const chave = secao.dataset.carrossel;
        const lista = secao.querySelector(".vp-lista-produtos");
        const btnPrev = secao.querySelector(`[data-carrossel-prev="${chave}"]`);
        const btnNext = secao.querySelector(`[data-carrossel-next="${chave}"]`);

        if (!lista || !btnPrev || !btnNext) return;

        let paginaAtual = 0;

        const atualizar = () => {
            const totalCards = lista.querySelectorAll(".vp-card-produto").length;
            const porPagina = obterCardsPorPagina(secao);
            const totalPaginas = Math.max(1, Math.ceil(totalCards / porPagina));

            if (paginaAtual >= totalPaginas) paginaAtual = totalPaginas - 1;
            if (paginaAtual < 0) paginaAtual = 0;

            lista.style.transform = `translateX(-${paginaAtual * 100}%)`;

            btnPrev.disabled = paginaAtual === 0;
            btnNext.disabled = paginaAtual >= totalPaginas - 1 || totalCards <= porPagina;

            secao.classList.toggle("sem-navegacao", totalCards <= porPagina);
        };

        btnPrev.addEventListener("click", () => {
            paginaAtual -= 1;
            atualizar();
        });

        btnNext.addEventListener("click", () => {
            paginaAtual += 1;
            atualizar();
        });

        window.addEventListener("resize", atualizar);
        atualizar();
    });
}

function obterCardsPorPagina(secao) {
    const valor = getComputedStyle(secao).getPropertyValue("--cards-por-pagina");
    const numero = Number(valor);

    return Number.isFinite(numero) && numero > 0 ? numero : 4;
}

function aplicarVariaveisTema(root, config = {}, plano = "FREE") {
    const corPrimaria = config.corPrimaria || "#156783";
    const corSecundaria = config.corSecundaria || "#b5d7df";
    const corFundo = config.corFundo || "#f5f7fa";
    const fontePrimaria = config.fontePrimaria || "Arial";
    const fonteSecundaria = config.fonteSecundaria || "Helvetica";
    const produtosLinha = config.produtosLinha || 4;

    const textoSobrePrimaria = corTextoContraste(corPrimaria);
    const textoSobreSecundaria = corTextoContraste(corSecundaria);
    const textoSobreFundo = corTextoContraste(corFundo);

    root.style.setProperty("--cor-primaria", corPrimaria);
    root.style.setProperty("--cor-secundaria", corSecundaria);
    root.style.setProperty("--cor-fundo", corFundo);

    root.style.setProperty("--texto-primaria", textoSobrePrimaria);
    root.style.setProperty("--texto-secundaria", textoSobreSecundaria);
    root.style.setProperty("--texto-fundo", textoSobreFundo);

    root.style.setProperty("--fonte-primaria", `"${fontePrimaria}", Arial, sans-serif`);
    root.style.setProperty("--fonte-secundaria", `"${fonteSecundaria}", Arial, sans-serif`);
    root.style.setProperty("--produtos-linha", produtosLinha);

    document.documentElement.style.setProperty("--cor-primaria", corPrimaria);
    document.documentElement.style.setProperty("--cor-secundaria", corSecundaria);
    document.documentElement.style.setProperty("--cor-fundo", corFundo);
    document.documentElement.style.setProperty("--texto-fundo", textoSobreFundo);

    document.body.style.backgroundColor = corFundo;
    document.body.style.color = textoSobreFundo;
    document.body.style.fontFamily = `"${fontePrimaria}", Arial, sans-serif`;
}

function obterPlanoLoja(loja) {
    return String(loja?.plano || "FREE").trim().toUpperCase();
}

function formatarPreco(preco) {
    return Number(preco || 0).toFixed(2).replace(".", ",");
}

function setTexto(root, seletor, texto) {
    const el = root.querySelector(seletor);
    if (el) el.textContent = texto;
}

function setSrc(root, seletor, src) {
    const el = root.querySelector(seletor);
    if (el) el.src = src;
}
