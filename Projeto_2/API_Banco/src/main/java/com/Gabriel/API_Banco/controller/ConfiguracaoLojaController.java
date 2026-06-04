package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.ConfiguracaoLojaDTO;
import com.Gabriel.API_Banco.model.ConfiguracaoLoja;
import com.Gabriel.API_Banco.service.ConfiguracaoLojaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/configuracao")
public class ConfiguracaoLojaController {

    private final ConfiguracaoLojaService service;

    public ConfiguracaoLojaController(ConfiguracaoLojaService service) {
        this.service = service;
    }

    @GetMapping("/buscar/{lojaId}")
    public ResponseEntity<ConfiguracaoLoja> buscarConfiguracao(@PathVariable Long lojaId) {
        ConfiguracaoLoja config = service.buscarOuCriarConfiguracao(lojaId);
        return ResponseEntity.ok(config);
    }

    @PutMapping("/editar/{lojaId}")
    public ResponseEntity<ConfiguracaoLoja> atualizarConfiguracao(
            @PathVariable Long lojaId,
            @RequestBody ConfiguracaoLojaDTO dto
    ) {
        ConfiguracaoLoja atualizada = service.atualizarConfiguracao(lojaId, dto);
        return ResponseEntity.ok(atualizada);
    }

    @PostMapping("/{lojaId}/banner")
    public ResponseEntity<?> uploadBanner(
            @PathVariable Long lojaId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            ConfiguracaoLoja atualizada = service.atualizarBanner(lojaId, file);
            return ResponseEntity.ok(atualizada);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        } catch (IOException erro) {
            return ResponseEntity.status(500).body("Erro ao enviar imagem para o Cloudinary.");
        }
    }
}