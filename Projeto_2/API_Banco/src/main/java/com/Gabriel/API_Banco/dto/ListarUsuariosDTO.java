package com.Gabriel.API_Banco.dto;

public record ListarUsuariosDTO (
    Long id,
    String nome,
    String email,
    String tipo_usuario
) {}
