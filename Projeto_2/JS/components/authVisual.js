export function iniciarRotacaoGifs() {
    const gifEl = document.getElementById("authGif");
    const dots = document.querySelectorAll(".gif-dot");

    if (!gifEl) return;

    const gifs = [
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmxoZGxkZHZtMG54dGtmajh0cnp3M25wZDBnanRkMnEzZnJoNHVkaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUOrw1p8ATwqTPX1NC/giphy.gif",
        "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTI0ODVwaTQ5cWEweGNqdDFnNDJ1bTJpazV4am90czBxcHRyYjdjcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1gPZLtbPVuQE2JSEqO/giphy.gif",
        "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDExcGwwZXU0cmxwZGNyY3pka2pxeDQ1aG52NTEzZHlwdzBzZDFuOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CuCG0cbhhelG88BMmr/giphy.gif"
    ];

    let indiceAtual = 0;

    function atualizarIndicadores() {
        dots.forEach((dot, index) => {
            dot.classList.toggle("ativo", index === indiceAtual);
        });
    }

    function trocarGif(novoIndice) {
        gifEl.classList.add("trocando");

        setTimeout(() => {
            indiceAtual = novoIndice;
            gifEl.src = gifs[indiceAtual];
            atualizarIndicadores();
            gifEl.classList.remove("trocando");
        }, 220);
    }

    atualizarIndicadores();

    setInterval(() => {
        const proximo = (indiceAtual + 1) % gifs.length;
        trocarGif(proximo);
    }, 5000);
}