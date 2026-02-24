package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.CriarCotacaoDTO;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.service.CotacaoService;
import org.springframework.web.bind.annotation.*;

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
}
