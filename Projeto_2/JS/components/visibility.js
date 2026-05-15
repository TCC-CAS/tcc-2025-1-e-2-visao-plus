// js/components/visibility.js

export function esconderBlocos(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

export function mostrarBlocos(ids, display = "block") {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = display;
    });
}
