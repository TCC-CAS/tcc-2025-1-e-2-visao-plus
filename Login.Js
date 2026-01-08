document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#loginForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const senha = document.querySelector("#senha").value;

        //Validações de nome e email
        if (!nome || !email || !senha) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Criar objeto usuário
        const usuarioLogin = {
            nome: nome,
            email: email,
            senha: senha
        };


        // Enviar dados para a API
        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioLogin)
            });

            // Se deu erro:
            if (!response.ok) {
                const mensagemErro = await response.text();
                alert(mensagemErro);
                return;
            }

            // Se chegou aqui, deu certo:
            const usuarioBackend = await response.json();

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarioBackend)
            );

            // espera 7 segundos (7000 ms)
            setTimeout(() => {
                window.location.href = "PaginaPrincipal.html";
            }, 7000);

        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com a API");
        }
    });
});