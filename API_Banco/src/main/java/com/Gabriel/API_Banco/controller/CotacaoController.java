package com.Gabriel.API_Banco.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Gabriel.API_Banco.dto.CriarLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.service.LojaService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cotacoes")
public class CotacaoController {

    private final LojaService lojaService;

    public CotacaoController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @PostMapping("/criarCotacao")
    public ResponseEntity<Loja> criarLoja(@RequestBody CriarLojaDTO dto) {
        Loja loja = lojaService.criarLoja(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(loja);
    }

    
}
