document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#cadastroLojaForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const obterUsuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        const dto = {
            nome: document.querySelector("#nome").value,
            email: document.querySelector("#email").value,
            cep: document.querySelector("#cep").value,
            cnpj: document.querySelector("#cnpj").value,
            endereco: document.querySelector("#endereco").value,
            idUsuario: obterUsuarioLogado.id
        };

        try {
            const response = await fetch("http://localhost:8080/lojas/criarLoja", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dto)
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar loja");
            }

            alert("Loja criada com sucesso!");
            form.reset();

            setTimeout(() => {
                window.location.href = "./PaginaPerfil.html";
            }, 100);



        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com a API");
        }
    });
});
