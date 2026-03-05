document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#loginForm");
    const msgLogin = document.querySelector("#msgLogin");

    function mostrarMensagem(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.classList.remove("sucesso", "erro");
        elemento.classList.add("mostrar", tipo);

        setTimeout(() => {
            elemento.classList.remove("mostrar");
        }, 4000);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email").value.trim();
        const senha = document.querySelector("#senha").value;

        if (!nome || !email || !senha) {
            mostrarMensagem(
                msgLogin,
                "Preencha todos os campos.",
                "erro"
            );
            return;
        }

        const usuarioLogin = { nome, email, senha };

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioLogin)
            });

            if (!response.ok) {
                const mensagemErro = await response.text();
                mostrarMensagem(msgLogin, mensagemErro, "erro");
                return;
            }

            const usuarioBackend = await response.json();

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarioBackend)
            );

            mostrarMensagem(
                msgLogin,
                "Login bem-sucedido! Redirecionando...",
                "sucesso"
            );

            setTimeout(() => {
                window.location.href = "PaginaPrincipal.html";
            }, 3000);

        } catch (error) {
            console.error(error);
            mostrarMensagem(
                msgLogin,
                "Erro ao conectar com o servidor.",
                "erro"
            );
        }
    });
});