package com.Gabriel.API_Banco.dto;

public class ListarArmacaoDTO {

    private Long id;
    private String nome;
    private String tipo;
    private String marca;
    private String modelo;
    private String material;
    private String descricao;
    private Double preco;

    // construtor vazio (obrigatório pra frameworks)
    public ListarArmacaoDTO() {
    }

    // construtor para listagem
    public ListarArmacaoDTO(
            Long id,
            String nome,
            String tipo,
            String marca,
            String modelo,
            String material,
            String descricao,
            Double preco
    ) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.marca = marca;
        this.modelo = modelo;
        this.material = material;
        this.descricao = descricao;
        this.preco = preco;
    }
}
