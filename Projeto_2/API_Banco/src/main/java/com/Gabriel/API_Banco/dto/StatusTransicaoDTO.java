package com.Gabriel.API_Banco.dto;

import com.Gabriel.API_Banco.model.enums.StatusCotacao;

public class StatusTransicaoDTO {

    private StatusCotacao novoStatus;
    private Long idAtor; // id de quem está fazendo a ação (usuário ou loja)

    public StatusCotacao getNovoStatus() { return novoStatus; }
    public void setNovoStatus(StatusCotacao novoStatus) { this.novoStatus = novoStatus; }

    public Long getIdAtor() { return idAtor; }
    public void setIdAtor(Long idAtor) { this.idAtor = idAtor; }
}