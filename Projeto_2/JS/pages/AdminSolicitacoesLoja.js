const API_BASE = "https://tccvisionplus-production.up.railway.app";

const listaSolicitacoes = document.getElementById("admin-solicitacoes-loja");

async function carregarSolicitacoesLoja() {
    if (!listaSolicitacoes) return;

    try {
        const resposta = await fetch(`${API_BASE}/solicitacoes-loja`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar solicitações");
        }

        const solicitacoes = await resposta.json();

        listaSolicitacoes.innerHTML = "";

        if (solicitacoes.length === 0) {
            listaSolicitacoes.innerHTML = "<p>Nenhuma solicitação pendente.</p>";
            return;
        }

        solicitacoes.forEach(solicitacao => {
            const card = document.createElement("div");
            card.classList.add("card-solicitacao-loja");

            card.innerHTML = `
                <h4>${solicitacao.nome}</h4>
                <p><strong>CNPJ:</strong> ${solicitacao.cnpj}</p>
                <p><strong>Email:</strong> ${solicitacao.email || "-"}</p>
                <p><strong>CEP:</strong> ${solicitacao.cep || "-"}</p>
                <p><strong>Endereço:</strong> ${solicitacao.endereco || "-"}</p>
                <p><strong>Descrição:</strong> ${solicitacao.descricao || "-"}</p>

                <div class="acoes-solicitacao">
                    <button class="btn-aprovar" data-id="${solicitacao.id}">
                        Aprovar
                    </button>

                    <button class="btn-rejeitar" data-id="${solicitacao.id}">
                        Rejeitar
                    </button>
                </div>
            `;

            listaSolicitacoes.appendChild(card);
        });

    } catch (erro) {
        console.error(erro);
        listaSolicitacoes.innerHTML = "<p>Erro ao carregar solicitações.</p>";
    }
}

document.addEventListener("click", async (event) => {
    const btnAprovar = event.target.closest(".btn-aprovar");
    const btnRejeitar = event.target.closest(".btn-rejeitar");

    if (btnAprovar) {
        const id = btnAprovar.dataset.id;

        if (!confirm("Deseja aprovar esta solicitação?")) return;

        try {
            const resposta = await fetch(`${API_BASE}/solicitacoes-loja/${id}/aprovar`, {
                method: "POST"
            });

            if (!resposta.ok) {
                throw new Error("Erro ao aprovar solicitação");
            }

            alert("Solicitação aprovada. Loja criada com sucesso.");
            carregarSolicitacoesLoja();

        } catch (erro) {
            console.error(erro);
            alert("Erro ao aprovar solicitação.");
        }
    }

    if (btnRejeitar) {
        const id = btnRejeitar.dataset.id;

        if (!confirm("Deseja rejeitar esta solicitação?")) return;

        try {
            const resposta = await fetch(`${API_BASE}/solicitacoes-loja/${id}`, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                throw new Error("Erro ao rejeitar solicitação");
            }

            alert("Solicitação rejeitada.");
            carregarSolicitacoesLoja();

        } catch (erro) {
            console.error(erro);
            alert("Erro ao rejeitar solicitação.");
        }
    }
});

carregarSolicitacoesLoja();