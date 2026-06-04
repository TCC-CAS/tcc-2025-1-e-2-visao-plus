package com.Gabriel.API_Banco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MensagemCotacaoDTO {

    private Long id;
    private Long idCotacao;
    private Long idRemetente;
    private String nomeRemetente;
    private String texto;
    private LocalDateTime enviadoEm;

    // getters e setters
}
