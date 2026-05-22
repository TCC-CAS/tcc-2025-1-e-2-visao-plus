package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.SolicitacaoLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.SolicitacaoLoja;
import com.Gabriel.API_Banco.service.SolicitacaoLojaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes-loja")
@CrossOrigin(origins = "*")
public class SolicitacaoLojaController {

    private final SolicitacaoLojaService service;

    public SolicitacaoLojaController(SolicitacaoLojaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoLoja> criar(@RequestBody SolicitacaoLojaDTO dto) {
        return ResponseEntity.ok(service.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoLoja>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<Loja> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(service.aprovar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<SolicitacaoLoja> buscarPorUsuario(@PathVariable Long idUsuario) {
        SolicitacaoLoja solicitacao = service.buscarPorUsuario(idUsuario);

        if (solicitacao == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(solicitacao);
    }
}