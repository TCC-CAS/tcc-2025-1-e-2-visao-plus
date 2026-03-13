package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.CriarCotacaoDTO;
import com.Gabriel.API_Banco.dto.ListarCotacoesDTO;
import com.Gabriel.API_Banco.dto.ListarLentesDTO;
import com.Gabriel.API_Banco.dto.ResponderCotacaoDTO;
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

    @PostMapping("/cotacoes/{id}/responder")
    public Cotacao responder(@PathVariable Long id,
                             @RequestBody ResponderCotacaoDTO dto,
                             @RequestParam Long idLojaLogada) {

        return cotacaoService.responderCotacao(id, dto, idLojaLogada);
    }
}
