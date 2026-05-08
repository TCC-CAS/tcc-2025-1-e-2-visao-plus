package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.EnviarMensagemDTO;
import com.Gabriel.API_Banco.dto.MensagemCotacaoDTO;
import com.Gabriel.API_Banco.service.MensagemCotacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
@CrossOrigin(origins = "*")
public class MensagemCotacaoController {

    @Autowired
    private MensagemCotacaoService mensagemService;

    @PostMapping("/enviar")
    public ResponseEntity<MensagemCotacaoDTO> enviar(@RequestBody EnviarMensagemDTO dto) {
        return ResponseEntity.ok(mensagemService.enviarMensagem(dto));
    }

    @GetMapping("/cotacao/{idCotacao}")
    public ResponseEntity<List<MensagemCotacaoDTO>> listar(@PathVariable Long idCotacao) {
        return ResponseEntity.ok(mensagemService.listarMensagens(idCotacao));
    }
}