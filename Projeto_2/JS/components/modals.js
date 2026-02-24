// js/components/modals.js

export function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) {
        console.error("Modal não encontrado:", idModal);
        return;
    }
    modal.classList.remove("hidden");
}

export function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) {
        console.error("Modal não encontrado:", idModal);
        return;
    }
    modal.classList.add("hidden");
}
