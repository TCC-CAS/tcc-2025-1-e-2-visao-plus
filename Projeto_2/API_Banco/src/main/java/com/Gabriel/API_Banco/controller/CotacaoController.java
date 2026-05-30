package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.*;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.service.CotacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<?> criar(@RequestBody CriarCotacaoDTO dto) {
        try {
            Cotacao cotacao = cotacaoService.criarCotacao(dto);
            return ResponseEntity.ok(cotacao);
        } catch (ResponseStatusException erro) {
            return ResponseEntity
                    .status(erro.getStatusCode())
                    .body(erro.getReason());
        } catch (RuntimeException erro) {
            return ResponseEntity
                    .badRequest()
                    .body(erro.getMessage());
        }
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
    @PutMapping("/{id}/responder")
    public ResponseEntity<?> responder(
            @PathVariable Long id,
            @RequestBody ResponderCotacaoDTO dto,
            @RequestParam Long idLoja
    ) {
        try {
            Cotacao cotacao = cotacaoService.enviarProposta(id, dto, idLoja);
            return ResponseEntity.ok(cotacao);

        } catch (ResponseStatusException erro) {
            return ResponseEntity
                    .status(erro.getStatusCode())
                    .body(erro.getReason());

        } catch (RuntimeException erro) {
            return ResponseEntity
                    .badRequest()
                    .body(erro.getMessage());

        } catch (Exception erro) {
            erro.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Erro interno ao responder cotação.");
        }
    }

    // Todas as outras transições de status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Cotacao> transicionarStatus(@PathVariable Long id,
                                                      @RequestBody StatusTransicaoDTO dto) {
        return ResponseEntity.ok(cotacaoService.transicionarStatus(id, dto));
    }
}
