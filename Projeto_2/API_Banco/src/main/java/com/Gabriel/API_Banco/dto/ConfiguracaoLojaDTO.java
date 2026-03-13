package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class ConfiguracaoLojaDTO {


    private String corPrimaria;
    private String corSecundaria;
    private String corFundo;
    private String fontePrimaria;
    private String fonteSecundaria;
    private String layoutPagina;
    private Boolean mostrarMarca;
    private String layoutProdutos;
    private Integer produtosLinha;
    private Boolean mostrarPreco;
}
