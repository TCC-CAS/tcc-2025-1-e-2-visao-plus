const API_BASE_URL = "http://localhost:8080/"; // ajusta se precisar

document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

function initPaginaAdmin() {
    setNomeLoja("Ótica XYZ"); // depois você pode buscar isso do backend
    carregarArmacoes();
    carregarLentes();
    configurarEventos();
}
