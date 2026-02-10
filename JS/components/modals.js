// js/components/modals.js

export function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) return;

    modal.classList.add("ativo");
}

export function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) return;

    modal.classList.remove("ativo");
}
