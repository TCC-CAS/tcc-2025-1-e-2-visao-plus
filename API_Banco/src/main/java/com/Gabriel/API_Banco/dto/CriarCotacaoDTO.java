package com.Gabriel.API_Banco.dto;

public class CriarCotacaoDTO {

    private String nome;
    private Double valor;
    private Long idLoja;
    private Long idUsuario;
    private String emailUsuario;
    private String emailLoja;
    private String status;
    private

    
    // getters e setters
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public Double getValor() {
        return valor;
    }
    public void setValor(Double valor) {
        this.valor = valor;
    }
    public Long getIdLoja() {
        return idLoja;
    }
    public void setIdLoja(Long idLoja) {
        this.idLoja = idLoja;
    }
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getEmailUsuario() {
        return emailUsuario;
    }
    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }
    public String getEmailLoja() {
        return emailLoja;
    }
    public void setEmailLoja(String emailLoja) {
        this.emailLoja = emailLoja;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}