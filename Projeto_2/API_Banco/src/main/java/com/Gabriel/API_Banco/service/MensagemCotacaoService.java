package com.Gabriel.API_Banco.service;
import com.Gabriel.API_Banco.dto.*;
import com.Gabriel.API_Banco.model.*;
import com.Gabriel.API_Banco.repository.CotacaoRepositorio;
import com.Gabriel.API_Banco.repository.MensagemCotacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
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
        Cotacao cotacao = cotacaoRepo.findById(dto.getIdCotacao())
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada"));

        Usuario remetente = usuarioRepo.findById(dto.getIdRemetente())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        MensagemCotacao msg = new MensagemCotacao();
        msg.setCotacao(cotacao);
        msg.setRemetente(remetente);
        msg.setTexto(dto.getTexto());

        mensagemRepo.save(msg);

        return toDTO(msg);
    }

    public List<MensagemCotacaoDTO> listarMensagens(Long idCotacao) {
        return mensagemRepo.findByCotacaoIdOrderByEnviadoEmAsc(idCotacao)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
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