package com.Gabriel.API_Banco.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "configuracao_loja")
public class ConfiguracaoLoja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_loja", nullable = false, unique = true)
    private Loja loja;

    @Column(name = "corPrimaria")
    private String corPrimaria;

    @Column(name = "corSecundaria")
    private String corSecundaria;

    @Column(name = "corFundo")
    private String corFundo;

    @Column(name = "fontePrimaria")
    private String fontePrimaria;

    @Column(name = "fonteSecundaria")
    private String fonteSecundaria;

    @Column(name = "layout_pagina")
    private String layoutPagina;

    @Column(name = "mostrar_marca")
    private Boolean mostrarMarca;

    @Column(name = "layout_produtos")
    private String layoutProdutos;

    @Column(name= "produtos_linha")
    private Integer produtosLinha;

    @Column(name= "mostrar_preco")
    private Boolean mostrarPreco;
}
