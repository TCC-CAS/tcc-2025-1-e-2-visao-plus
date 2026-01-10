package com.Gabriel.API_Banco.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.service.LojaService;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/lojas")
public class LojaController {

    private final LojaService lojaService;

    public LojaController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @PostMapping("/criarLoja")
    public ResponseEntity<Loja> criarLoja(@RequestBody Loja loja) {
        Loja lojaCriada = lojaService.criarLoja(loja);
        return ResponseEntity.status(HttpStatus.CREATED).body(lojaCriada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarLoja(@PathVariable Long id) {
        lojaService.deletarLoja(id);
        return ResponseEntity.ok("Loja deletada com sucesso!");
    }
}

