export function chamarEstilizacaoSearchBar() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/components/SearchBars.css";
    document.head.appendChild(link);
}

let lojasOriginais = [];

// recebe todas as lojas carregadas
export function initBuscaLojas(lojas) {
    lojasOriginais = lojas;

    const input = document.getElementById("busca-lojas");
    if (!input) return;

    input.addEventListener("input", () => {
        const termo = input.value.toLowerCase().trim();

        const filtradas = lojasOriginais.filter(loja =>
            loja.nome.toLowerCase().includes(termo) ||
            loja.endereco.toLowerCase().includes(termo)
        );

        // reutiliza renderização existente
        window.renderizarLojas(filtradas);
    });
}