package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.CriarLenteDTO;
import com.Gabriel.API_Banco.dto.EditarLenteDTO;
import com.Gabriel.API_Banco.dto.ListarLentesDTO;
import com.Gabriel.API_Banco.model.Lente;
import com.Gabriel.API_Banco.service.LenteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // libera pro front
@RestController
@RequestMapping("/lentes")

public class LenteController {

    private final LenteService lenteService;

    public LenteController(LenteService lenteService) {
        this.lenteService = lenteService;
    }

    //CRIAR LENTE
    @PostMapping("/criarLente")
    public ResponseEntity<Lente> criarLente(@RequestBody CriarLenteDTO dto) {
        Lente lenteCriada = lenteService.criarLente(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(lenteCriada);
    }

    //LISTAR TODAS AS LENTES
    @GetMapping
    public ResponseEntity<List<ListarLentesDTO>> listarTodas() {
        return ResponseEntity.ok(lenteService.listarLentes());
    }

    //LISTAR LENTES POR LOJA
    @GetMapping("/listarLentes/{idLoja}")
    public ResponseEntity<List<ListarLentesDTO>> listarPorLoja(@PathVariable Long idLoja) {
        return ResponseEntity.ok(lenteService.listarLentesPorLoja(idLoja));
    }

    //EDITAR LENTE
    @PutMapping("/editarLente/{id}")
    public ResponseEntity<Lente> editarLente(
            @PathVariable Long id,
            @RequestBody EditarLenteDTO dto
    ) {
        return ResponseEntity.ok(lenteService.editarLente(id, dto));
    }

    //DELETAR LENTE
    @DeleteMapping("/deletarLente/{id}")
    public ResponseEntity<Void> deletarLente(@PathVariable Long id) {
        lenteService.deletarLente(id);
        return ResponseEntity.noContent().build();
    }
}
