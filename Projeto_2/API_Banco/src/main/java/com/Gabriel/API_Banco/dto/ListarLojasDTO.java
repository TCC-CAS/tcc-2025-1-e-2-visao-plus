package com.Gabriel.API_Banco.dto;

public record ListarLojasDTO(
        Long id,
        String nome,
        String email,
        String cnpj,
        String cep,
        String endereco,
        String descricao,
        String fotoUrl
) {}