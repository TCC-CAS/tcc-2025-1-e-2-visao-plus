package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class CriarCotacaoDTO {

    private CriarProdutoDTO produto;
    private Long idUsuario;
    private Long idLoja;



}