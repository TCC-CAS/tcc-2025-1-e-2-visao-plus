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
    private Long config;

    @OneToOne
    @JoinColumn(name = "id_loja")
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
    private String layout_pagina;

    @Column(name = "mostrar_banner")
    private boolean mostrar_banner;

    @Column(name = "layout_produtos")
    private String layout_produtos;

    @Column(name= "produtos_linha")
    private Integer produtos_linha;

    @Column(name= "mostrar_preco")
    private boolean mostrar_preco;
}
