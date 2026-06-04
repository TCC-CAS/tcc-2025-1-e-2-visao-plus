package com.Gabriel.API_Banco.dto;

import lombok.Data;

import java.util.List;

@Data
public class EnviarCupomUsuariosDTO {
    private List<String> emails;
}