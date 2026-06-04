package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class RedefinirSenhaDTO {
    private String email;
    private String token;
    private String novaSenha;
}