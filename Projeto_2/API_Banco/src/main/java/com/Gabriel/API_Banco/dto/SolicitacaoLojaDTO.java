package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class SolicitacaoLojaDTO {
    private Long idUsuario;
    private String nome;
    private String email;
    private String cnpj;
    private String cep;
    private String endereco;
    private String descricao;
}