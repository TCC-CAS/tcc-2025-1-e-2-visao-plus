package com.Gabriel.API_Banco.dto;

public class ListarLentesDTO {

    private Long id;
    private String nome;
    private String tipo;
    private String marca;
    private String modelo;
    private String material;
    private String descricao;
    private Double preco;

    // construtor vazio (obrigatório pra frameworks)
    public ListarLentesDTO() {
    }

    // construtor para listagem
    public ListarLentesDTO(
            String nome,
            String tipo,
            String marca,
            String modelo,
            String material,
            String descricao,
            Double preco
    ) {
        this.nome = nome;
        this.tipo = tipo;
        this.marca = marca;
        this.modelo = modelo;
        this.material = material;
        this.descricao = descricao;
        this.preco = preco;
    }

    // getters e setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMaterial(){
        return material;
    }

    public void setMaterial(String material){
        this.material = material;
    }

    public String getDescricao(){
        return descricao;
    }

    public void setDescricao(String descricao){
        this.descricao = descricao;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }



}
