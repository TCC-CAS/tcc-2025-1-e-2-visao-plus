package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.*;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.service.CotacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*") // Permite requisições do frontend
@RestController
@RequestMapping("/cotacoes")
public class CotacaoController {

    private final CotacaoService cotacaoService;

    public CotacaoController(CotacaoService cotacaoService) {
        this.cotacaoService = cotacaoService;
    }

    @PostMapping("/criarCotacao")
    public Cotacao criar(@RequestBody CriarCotacaoDTO dto) {
        return cotacaoService.criarCotacao(dto);
    }

    @GetMapping("/listarCotacoesPU/{idUsuario}")
    public ResponseEntity<List<ListarCotacoesDTO>> ListarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(cotacaoService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/listarCotacoesPL/{idLoja}")
    public ResponseEntity<List<ListarCotacoesDTO>> listarPorLoja(@PathVariable Long idLoja) {
        return ResponseEntity.ok(cotacaoService.listarPorLoja(idLoja));
    }

    // Loja envia proposta com valor + prazo
    @PatchMapping("/{id}/responder")
    public ResponseEntity<Cotacao> responder(@PathVariable Long id,
                                             @RequestBody ResponderCotacaoDTO dto,
                                             @RequestParam Long idLojaLogada) {
        return ResponseEntity.ok(cotacaoService.enviarProposta(id, dto, idLojaLogada));
    }

    // Todas as outras transições de status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Cotacao> transicionarStatus(@PathVariable Long id,
                                                      @RequestBody StatusTransicaoDTO dto) {
        return ResponseEntity.ok(cotacaoService.transicionarStatus(id, dto));
    }
}
