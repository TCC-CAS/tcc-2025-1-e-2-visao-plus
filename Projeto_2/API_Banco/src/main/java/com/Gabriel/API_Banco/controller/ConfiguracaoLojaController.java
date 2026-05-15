package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.ConfiguracaoLojaDTO;
import com.Gabriel.API_Banco.model.ConfiguracaoLoja;
import com.Gabriel.API_Banco.service.ConfiguracaoLojaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/configuracao")
public class ConfiguracaoLojaController {

    private final ConfiguracaoLojaService service;

    public ConfiguracaoLojaController(ConfiguracaoLojaService service) {
        this.service = service;
    }

    /**
     * Busca a configuração da loja.
     * Se não existir, cria uma padrão.
     */
    @GetMapping("/buscar/{lojaId}")
    public ResponseEntity<ConfiguracaoLoja> buscarConfiguracao(
            @PathVariable Long lojaId
    ) {
        ConfiguracaoLoja config = service.buscarOuCriarConfiguracao(lojaId);
        return ResponseEntity.ok(config);
    }

    /**
     * Atualiza a configuração da loja
     */
    @PutMapping("/editar/{lojaId}")
    public ResponseEntity<ConfiguracaoLoja> atualizarConfiguracao(
            @PathVariable Long lojaId,
            @RequestBody ConfiguracaoLojaDTO dto
    ) {
        ConfiguracaoLoja atualizada =
                service.atualizarConfiguracao(lojaId, dto);

        return ResponseEntity.ok(atualizada);
    }
}
