package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.EnviarMensagemDTO;
import com.Gabriel.API_Banco.dto.MensagemCotacaoDTO;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.model.MensagemCotacao;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.CotacaoRepositorio;
import com.Gabriel.API_Banco.repository.MensagemCotacaoRepository;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MensagemCotacaoService {

    @Autowired
    private MensagemCotacaoRepository mensagemRepo;

    @Autowired
    private CotacaoRepositorio cotacaoRepo;

    @Autowired
    private UsuarioRepositorio usuarioRepo;

    public MensagemCotacaoDTO enviarMensagem(EnviarMensagemDTO dto) {
        validarDtoEnvio(dto);

        Cotacao cotacao = cotacaoRepo.findById(dto.getIdCotacao())
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada."));

        Usuario remetente = usuarioRepo.findById(dto.getIdRemetente())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        validarParticipanteDaCotacao(cotacao, remetente.getId());

        validarCotacaoPermiteMensagem(cotacao);

        MensagemCotacao msg = new MensagemCotacao();
        msg.setCotacao(cotacao);
        msg.setRemetente(remetente);
        msg.setTexto(dto.getTexto().trim());

        mensagemRepo.save(msg);

        return toDTO(msg);
    }

    public List<MensagemCotacaoDTO> listarMensagens(Long idCotacao, Long idUsuario) {
        if (idUsuario == null) {
            throw new RuntimeException("Usuário obrigatório para listar mensagens.");
        }

        Cotacao cotacao = cotacaoRepo.findById(idCotacao)
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada."));

        validarParticipanteDaCotacao(cotacao, idUsuario);

        return mensagemRepo.findByCotacaoIdOrderByEnviadoEmAsc(idCotacao)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private void validarDtoEnvio(EnviarMensagemDTO dto) {
        if (dto.getIdCotacao() == null) {
            throw new RuntimeException("Cotação obrigatória.");
        }

        if (dto.getIdRemetente() == null) {
            throw new RuntimeException("Remetente obrigatório.");
        }

        if (dto.getTexto() == null || dto.getTexto().trim().isEmpty()) {
            throw new RuntimeException("Mensagem não pode estar vazia.");
        }

        if (dto.getTexto().trim().length() > 1000) {
            throw new RuntimeException("Mensagem deve ter no máximo 1000 caracteres.");
        }
    }

    private void validarParticipanteDaCotacao(Cotacao cotacao, Long idUsuario) {
        boolean ehConsumidorDaCotacao =
                cotacao.getUsuario() != null &&
                        cotacao.getUsuario().getId().equals(idUsuario);

        boolean ehDonoDaLoja =
                cotacao.getLoja() != null &&
                        cotacao.getLoja().getDono() != null &&
                        cotacao.getLoja().getDono().getId().equals(idUsuario);

        if (!ehConsumidorDaCotacao && !ehDonoDaLoja) {
            throw new RuntimeException("Você não tem permissão para acessar as mensagens desta cotação.");
        }
    }

    private void validarCotacaoPermiteMensagem(Cotacao cotacao) {
        if (cotacao.getStatus() == null) return;

        String status = cotacao.getStatus().name();

        if (
                status.equals("CANCELADA") ||
                        status.equals("REJEITADA") ||
                        status.equals("FINALIZADA")
        ) {
            throw new RuntimeException("Não é possível enviar mensagens em uma cotação encerrada.");
        }
    }

    private MensagemCotacaoDTO toDTO(MensagemCotacao msg) {
        MensagemCotacaoDTO dto = new MensagemCotacaoDTO();

        dto.setId(msg.getId());
        dto.setIdCotacao(msg.getCotacao().getId());
        dto.setIdRemetente(msg.getRemetente().getId());
        dto.setNomeRemetente(msg.getRemetente().getNome());
        dto.setTexto(msg.getTexto());
        dto.setEnviadoEm(msg.getEnviadoEm());

        return dto;
    }
}