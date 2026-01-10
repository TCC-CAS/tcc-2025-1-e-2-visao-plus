package com.Gabriel.API_Banco.dto;

import java.time.LocalDate;

public class CriarCotacaoDTO {

    private String produto;
    private Long idUsuario;
    private Double valorBase;
    private Double valorFinal;
    private LocalDate dataCriacao;
    private Long idLoja;
    private LocalDate dataAprovacao;
    private String status;

    public String getProduto() {
        return produto;
    }
    public void setProduto(String produto) {
        this.produto = produto;
    }
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public Double getValorBase() {
        return valorBase;
    }
    public void setValorBase(Double valorBase) {
        this.valorBase = valorBase;
    }
    public Double getValorFinal() {
        return valorFinal;
    }
    public void setValorFinal(Double valorFinal) {
        this.valorFinal = valorFinal;
    }
    public LocalDate getDataCriacao() {
        return dataCriacao;
    }
    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
    public Long getIdLoja() {
        return idLoja;
    }
    public void setIdLoja(Long idLoja) {
        this.idLoja = idLoja;
    }
    public LocalDate getDataAprovacao() {
        return dataAprovacao;
    }
    public void setDataAprovacao(LocalDate dataAprovacao) {
        this.dataAprovacao = dataAprovacao;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}