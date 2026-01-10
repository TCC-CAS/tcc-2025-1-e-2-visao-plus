package com.Gabriel.API_Banco.dto;

public class CriarCotacaoDTO {

    private Long idProduto;
    private Long idUsuario;
    private Long idLoja;

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
    public Long getIdLoja() {
        return idLoja;
    }
    public void setIdLoja(Long idLoja) {
        this.idLoja = idLoja;
    }
  
}