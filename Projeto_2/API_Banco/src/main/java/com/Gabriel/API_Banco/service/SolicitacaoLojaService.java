package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.SolicitacaoLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.SolicitacaoLoja;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.SolicitacaoLojaRepository;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitacaoLojaService {

    private final SolicitacaoLojaRepository solicitacaoRepository;
    private final UsuarioRepositorio usuarioRepository;
    private final LojaRepositorio lojaRepository;

    public SolicitacaoLojaService(
            SolicitacaoLojaRepository solicitacaoRepository,
            UsuarioRepositorio usuarioRepository,
            LojaRepositorio lojaRepository
    ) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.lojaRepository = lojaRepository;
    }

    public SolicitacaoLoja criar(SolicitacaoLojaDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (solicitacaoRepository.existsBySolicitante(usuario)) {
            throw new RuntimeException("Este usuário já possui uma solicitação de loja pendente");
        }

        if (solicitacaoRepository.existsByCnpj(dto.getCnpj())) {
            throw new RuntimeException("Já existe uma solicitação pendente para este CNPJ");
        }

        SolicitacaoLoja solicitacao = new SolicitacaoLoja();
        solicitacao.setSolicitante(usuario);
        solicitacao.setNome(dto.getNome());
        solicitacao.setEmail(dto.getEmail());
        solicitacao.setCnpj(dto.getCnpj());
        solicitacao.setCep(dto.getCep());
        solicitacao.setEndereco(dto.getEndereco());
        solicitacao.setDescricao(dto.getDescricao());

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoLoja> listarTodas() {
        return solicitacaoRepository.findAllByOrderByDataSolicitacaoDesc();
    }

    public Loja aprovar(Long idSolicitacao) {

        SolicitacaoLoja solicitacao = solicitacaoRepository.findById(idSolicitacao)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        Usuario usuario = solicitacao.getSolicitante();

        Loja loja = new Loja();
        loja.setDono(usuario);
        loja.setNome(solicitacao.getNome());
        loja.setEmail(solicitacao.getEmail());
        loja.setCnpj(solicitacao.getCnpj());
        loja.setCep(solicitacao.getCep());
        loja.setEndereco(solicitacao.getEndereco());
        loja.setDescricao(solicitacao.getDescricao());

        Loja lojaCriada = lojaRepository.save(loja);

        usuario.setTipoUsuario("Vendedor");
        usuarioRepository.save(usuario);

        solicitacaoRepository.delete(solicitacao);

        return lojaCriada;
    }

    public SolicitacaoLoja buscarPorUsuario(Long idUsuario) {
        return solicitacaoRepository.findBySolicitanteId(idUsuario)
                .orElse(null);
    }

    public void deletar(Long idSolicitacao) {
        if (!solicitacaoRepository.existsById(idSolicitacao)) {
            throw new RuntimeException("Solicitação não encontrada");
        }

        solicitacaoRepository.deleteById(idSolicitacao);
    }
}