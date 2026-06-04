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
    public ResponseEntity<?> enviar(@RequestBody EnviarMensagemDTO dto) {
        try {
            MensagemCotacaoDTO mensagem = mensagemService.enviarMensagem(dto);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }

    @GetMapping("/cotacao/{idCotacao}")
    public ResponseEntity<?> listar(
            @PathVariable Long idCotacao,
            @RequestParam Long idUsuario
    ) {
        try {
            List<MensagemCotacaoDTO> mensagens =
                    mensagemService.listarMensagens(idCotacao, idUsuario);

            return ResponseEntity.ok(mensagens);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }
}