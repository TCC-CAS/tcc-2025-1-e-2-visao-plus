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
        const usuario = {
            nome: nome,
            email: email,
            senha: senha
        };


        // Enviar dados para a API
        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "Post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error("Erro ao logar usuário");
            }

            const mensagem = await response.text();
            alert(mensagem);

            form.reset();

        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com a API");
        }
    });
});