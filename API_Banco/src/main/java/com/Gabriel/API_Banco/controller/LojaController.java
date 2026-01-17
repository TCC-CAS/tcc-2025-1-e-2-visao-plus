package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.EditarLojaDTO;
import com.Gabriel.API_Banco.dto.ListarLojasDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Gabriel.API_Banco.dto.BuscarLojaDTO;

import com.Gabriel.API_Banco.dto.CriarLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.service.LojaService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/lojas")
public class LojaController {

    private final LojaService lojaService;

    public LojaController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @PostMapping("/criarLoja")
    public ResponseEntity<Loja> criarLoja(@RequestBody CriarLojaDTO dto) {
        Loja loja = lojaService.criarLoja(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(loja);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarLoja(@PathVariable Long id) {
        lojaService.deletarLoja(id);
        return ResponseEntity.ok("Loja deletada com sucesso!");
    }

    @PostMapping("/buscarLoja")
    public ResponseEntity<Loja> buscarLojaPorId(@RequestBody Long idUsuario) {
        
        return lojaService.findByIdUsuario(idUsuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/editarLoja")
    public ResponseEntity<Loja> editarLoja(@RequestBody EditarLojaDTO dto){
        Loja loja = lojaService.editarLoja(dto);
        return ResponseEntity.status(HttpStatus.OK).body(loja);
    }

    @GetMapping("/listarLojas")
    public ResponseEntity<List<ListarLojasDTO>> listarLojas() {
        return ResponseEntity.ok(lojaService.listarTodas());
    }
    
}
