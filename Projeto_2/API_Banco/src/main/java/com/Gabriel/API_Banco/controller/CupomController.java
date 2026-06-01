package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.AplicarCupomDTO;
import com.Gabriel.API_Banco.dto.CriarCupomDTO;
import com.Gabriel.API_Banco.dto.EditarCupomDTO;
import com.Gabriel.API_Banco.dto.EnviarCupomUsuariosDTO;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.model.Cupom;
import com.Gabriel.API_Banco.model.CupomUsuario;
import com.Gabriel.API_Banco.service.CupomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cupons")
public class CupomController {

    private final CupomService cupomService;

    public CupomController(CupomService cupomService) {
        this.cupomService = cupomService;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody CriarCupomDTO dto) {
        try {
            return ResponseEntity.ok(cupomService.criar(dto));
        } catch (ResponseStatusException erro) {
            return ResponseEntity.status(erro.getStatusCode()).body(erro.getReason());
        }
    }

    @GetMapping("/loja/{idLoja}")
    public ResponseEntity<?> listarPorLoja(@PathVariable Long idLoja) {
        return ResponseEntity.ok(cupomService.listarPorLoja(idLoja));
    }

    @GetMapping("/loja/{idLoja}/resumo")
    public ResponseEntity<?> resumoPorLoja(@PathVariable Long idLoja) {
        return ResponseEntity.ok(cupomService.resumoPorLoja(idLoja));
    }

    @PutMapping("/{idCupom}")
    public ResponseEntity<?> editar(@PathVariable Long idCupom, @RequestBody EditarCupomDTO dto) {
        try {
            return ResponseEntity.ok(cupomService.editar(idCupom, dto));
        } catch (ResponseStatusException erro) {
            return ResponseEntity.status(erro.getStatusCode()).body(erro.getReason());
        }
    }

    @PatchMapping("/{idCupom}/ativar-publico")
    public ResponseEntity<?> ativarPublico(@PathVariable Long idCupom) {
        try {
            return ResponseEntity.ok(cupomService.ativarPublico(idCupom));
        } catch (ResponseStatusException erro) {
            return ResponseEntity.status(erro.getStatusCode()).body(erro.getReason());
        }
    }

    @PatchMapping("/{idCupom}/desativar")
    public ResponseEntity<?> desativar(@PathVariable Long idCupom) {
        return ResponseEntity.ok(cupomService.desativar(idCupom));
    }

    @DeleteMapping("/{idCupom}")
    public ResponseEntity<?> deletar(@PathVariable Long idCupom) {
        cupomService.deletarLogico(idCupom);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{idCupom}/enviar-usuarios")
    public ResponseEntity<?> enviarParaUsuarios(
            @PathVariable Long idCupom,
            @RequestBody EnviarCupomUsuariosDTO dto
    ) {
        try {
            cupomService.enviarParaUsuarios(idCupom, dto);
            return ResponseEntity.ok("Cupom enviado/liberado para os usuários informados.");
        } catch (ResponseStatusException erro) {
            return ResponseEntity.status(erro.getStatusCode()).body(erro.getReason());
        }
    }

    @GetMapping("/loja/{idLoja}/publicos")
    public ResponseEntity<?> listarPublicosDaLoja(@PathVariable Long idLoja) {
        return ResponseEntity.ok(cupomService.listarPublicosDaLoja(idLoja));
    }

    @GetMapping("/globais")
    public ResponseEntity<?> listarGlobais() {
        return ResponseEntity.ok(cupomService.listarGlobais());
    }

    @PostMapping("/{idCupom}/resgatar")
    public ResponseEntity<?> resgatar(
            @PathVariable Long idCupom,
            @RequestParam Long idUsuario
    ) {
        try {
            CupomUsuario resgate = cupomService.resgatar(idCupom, idUsuario);
            return ResponseEntity.ok(resgate);
        } catch (ResponseStatusException erro) {
            return ResponseEntity.status(erro.getStatusCode()).body(erro.getReason());
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> listarCuponsDoUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(cupomService.listarCuponsDoUsuario(idUsuario));
    }

    @PostMapping("/cotacoes/{idCotacao}/aplicar")
    public ResponseEntity<?> aplicarCupom(
            @PathVariable Long idCotacao,
            @RequestBody AplicarCupomDTO dto
    ) {
        try {
            Cotacao cotacao = cupomService.aplicarCupomNaCotacao(idCotacao, dto);
            return ResponseEntity.ok(cotacao);
        } catch (ResponseStatusException erro) {
            return ResponseEntity.status(erro.getStatusCode()).body(erro.getReason());
        }
    }
}