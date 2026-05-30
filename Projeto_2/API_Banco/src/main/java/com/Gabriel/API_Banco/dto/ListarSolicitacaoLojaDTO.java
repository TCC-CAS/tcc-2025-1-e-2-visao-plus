package com.Gabriel.API_Banco.dto;

import com.Gabriel.API_Banco.model.SolicitacaoLoja;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ListarSolicitacaoLojaDTO {

    private Long id;
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

    private LocalDateTime dataSolicitacao;

    public ListarSolicitacaoLojaDTO(SolicitacaoLoja solicitacao) {
        this.id = solicitacao.getId();
        this.idUsuario = solicitacao.getUsuario().getId();

        this.razaoSocial = solicitacao.getRazaoSocial();
        this.nome = solicitacao.getNome();
        this.email = solicitacao.getEmail();
        this.cnpj = solicitacao.getCnpj();

        this.cep = solicitacao.getCep();
        this.logradouro = solicitacao.getLogradouro();
        this.numero = solicitacao.getNumero();
        this.complemento = solicitacao.getComplemento();
        this.bairro = solicitacao.getBairro();
        this.cidade = solicitacao.getCidade();
        this.uf = solicitacao.getUf();
        this.endereco = solicitacao.getEndereco();

        this.descricao = solicitacao.getDescricao();

        this.latitude = solicitacao.getLatitude();
        this.longitude = solicitacao.getLongitude();

        this.dataSolicitacao = solicitacao.getDataSolicitacao();
    }
}