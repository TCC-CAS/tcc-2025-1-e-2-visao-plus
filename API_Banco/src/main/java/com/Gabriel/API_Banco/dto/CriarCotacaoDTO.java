package com.Gabriel.API_Banco.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CriarCotacaoDTO {

    private Long idProduto;
    private Long idUsuario;
    private BigDecimal valorBase;
    private BigDecimal valorFinal;
    private LocalDate dataCriacao;
    private Long idLoja;
    private LocalDate dataAprovacao;
    private String status;

    // getters e setters
    public Long getIdProduto() {
        return idProduto;
    }
    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public BigDecimal getValorBase() {
        return valorBase;
    }
    public void setValorBase(BigDecimal valorBase) {
        this.valorBase = valorBase;
    }
    public BigDecimal getValorFinal() {
        return valorFinal;
    }
    public void setValorFinal(BigDecimal valorFinal) {
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