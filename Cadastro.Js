document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#cadastroForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    const confirmarSenha = document.querySelector("#confirmarSenha").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    const usuario = {
      nome: nome,
      email: email,
      senha: senha
    };

    try {
      const response = await fetch("http://localhost:8080/usuarios/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
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
