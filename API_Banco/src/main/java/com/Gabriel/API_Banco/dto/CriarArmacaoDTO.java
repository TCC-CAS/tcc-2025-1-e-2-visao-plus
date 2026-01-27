package com.Gabriel.API_Banco.dto;

public class CriarArmacaoDTO {

    private String nome;
    private String tipo;
    private String marca;
    private String modelo;
    private String material;
    private String descricao;
    private Double preco;
    private Long idLoja;

    //getters and setters
    public String getNome() {return nome;}
    public void setNome(String nome) {
        this.nome = nome;
    }
}
