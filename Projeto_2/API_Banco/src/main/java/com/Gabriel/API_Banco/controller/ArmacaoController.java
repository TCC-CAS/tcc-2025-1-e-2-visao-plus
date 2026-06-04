package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.*;
import com.Gabriel.API_Banco.model.Armacao;
import com.Gabriel.API_Banco.model.Lente;
import com.Gabriel.API_Banco.service.ArmacaoService;
import com.Gabriel.API_Banco.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/armacao")

public class ArmacaoController {

    private final ArmacaoService as;
    private final ImageService imageService;

    public ArmacaoController(ArmacaoService as,ImageService imageService){
        this.as = as;
        this.imageService = imageService;
    }

    //CRIAR ARMAÇÃO
    @PostMapping("/criarArmacao")
    public ResponseEntity<Armacao> criarArmacao(@RequestBody CriarArmacaoDTO dto) {
        Armacao armacaoCriada = as.criarArmacao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(armacaoCriada);
    }

    //LISTAR TODAS AS ARMAÇÃO
    @GetMapping
    public ResponseEntity<List<ListarArmacaoDTO>> listarTodas() {
        return ResponseEntity.ok(as.listarArmacoes());
    }

    //LISTAR ARMAÇÃO POR LOJA
    @GetMapping("/listarArmacoes/{idLoja}")
    public ResponseEntity<List<ListarArmacaoDTO>> listarPorLoja(@PathVariable Long idLoja) {
        return ResponseEntity.ok(as.listarArmacaoPorLoja(idLoja));
    }

    //EDITAR ARMAÇÃO
    @PutMapping("/editarArmacao/{id}")
    public ResponseEntity<Armacao> editarArmacao(
            @PathVariable Long id,
            @RequestBody EditarArmacaoDTO dto
    ) {
        return ResponseEntity.ok(as.editarArmacao(id, dto));
    }

    //DELETAR LENTE
    @DeleteMapping("/deletarArmacao/{id}")
    public ResponseEntity<Void> deletarArmacao(@PathVariable Long id) {
        as.deletarArmacao(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<String> uploadFotoArmacao(@PathVariable Long id,@RequestParam("file") MultipartFile file
    ) throws IOException {

        String url = as.atualizarFotoArmacao(id, file);

        return ResponseEntity.ok(url);
    }
}
