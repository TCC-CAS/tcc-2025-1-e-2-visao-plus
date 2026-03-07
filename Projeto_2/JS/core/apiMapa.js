const secaoMapa = document.getElementById("secao-mapa");

export async function carregarMapa() {
    secaoMapa.innerHTML = `
        <div id="mapa"></div>
    `;
}