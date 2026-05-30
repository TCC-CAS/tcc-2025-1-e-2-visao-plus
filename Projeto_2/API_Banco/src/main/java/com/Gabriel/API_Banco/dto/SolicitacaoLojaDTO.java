package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class SolicitacaoLojaDTO {
    private Long idUsuario;

    private String razaoSocial;
    private String nome;
    private String email;
    private String cnpj;

    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String endereco;

    private String descricao;

    private Double latitude;
    private Double longitude;
}