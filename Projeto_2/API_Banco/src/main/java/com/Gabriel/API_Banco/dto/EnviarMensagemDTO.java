package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class EnviarMensagemDTO {

    private Long idCotacao;
    private Long idRemetente;
    private String texto;

    // getters e setters
}