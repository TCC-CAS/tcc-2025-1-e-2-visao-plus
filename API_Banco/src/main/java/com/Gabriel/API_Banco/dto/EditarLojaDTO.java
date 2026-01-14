package com.Gabriel.API_Banco.dto;

public class EditarLojaDTO {

    private String nome;
    private String cnpj;
    private Long idUsuario;
    private String email;
    private String endereco;
    private String cep;
    private Long id;

    // getters e setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public String getCEP() {return cep;}
    public void setCEP(String cep) {
        this.cep = cep;
    }
    public String getEndereco() {
        return endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCnpj() {
        return cnpj;
    }
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

}
