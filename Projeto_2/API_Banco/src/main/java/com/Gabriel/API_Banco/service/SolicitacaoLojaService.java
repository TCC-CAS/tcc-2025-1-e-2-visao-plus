package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.SolicitacaoLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.SolicitacaoLoja;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.SolicitacaoLojaRepository;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        validarCamposObrigatorios(dto);

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (solicitacaoRepository.existsByUsuario(usuario)) {
            throw new RuntimeException("Este usuário já possui uma solicitação de loja pendente.");
        }

        if (solicitacaoRepository.existsByCnpj(dto.getCnpj())) {
            throw new RuntimeException("Já existe uma solicitação pendente para este CNPJ.");
        }

        if (lojaRepository.findByCnpj(dto.getCnpj()).isPresent()) {
            throw new RuntimeException("Já existe uma loja cadastrada com este CNPJ.");
        }

        if (lojaRepository.findByDonoId(usuario.getId()).isPresent()) {
            throw new RuntimeException("Este usuário já possui uma loja cadastrada.");
        }

        SolicitacaoLoja solicitacao = new SolicitacaoLoja();

        solicitacao.setUsuario(usuario);

        solicitacao.setRazaoSocial(dto.getRazaoSocial());
        solicitacao.setNome(dto.getNome());
        solicitacao.setEmail(dto.getEmail());
        solicitacao.setCnpj(dto.getCnpj());

        solicitacao.setCep(dto.getCep());
        solicitacao.setLogradouro(dto.getLogradouro());
        solicitacao.setNumero(dto.getNumero());
        solicitacao.setComplemento(dto.getComplemento());
        solicitacao.setBairro(dto.getBairro());
        solicitacao.setCidade(dto.getCidade());
        solicitacao.setUf(dto.getUf());
        solicitacao.setEndereco(dto.getEndereco());

        solicitacao.setDescricao(dto.getDescricao());

        solicitacao.setLatitude(dto.getLatitude());
        solicitacao.setLongitude(dto.getLongitude());

        solicitacao.setDataSolicitacao(LocalDateTime.now());

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoLoja> listarTodas() {
        return solicitacaoRepository.findAllByOrderByDataSolicitacaoDesc();
    }

    @Transactional
    public Loja aprovar(Long idSolicitacao) {
        SolicitacaoLoja solicitacao = solicitacaoRepository.findById(idSolicitacao)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));

        Usuario usuario = solicitacao.getUsuario();

        if (lojaRepository.findByCnpj(solicitacao.getCnpj()).isPresent()) {
            throw new RuntimeException("Já existe uma loja cadastrada com este CNPJ.");
        }

        if (lojaRepository.findByDonoId(usuario.getId()).isPresent()) {
            throw new RuntimeException("Este usuário já possui uma loja cadastrada.");
        }

        Loja loja = new Loja();

        loja.setDono(usuario);

        loja.setRazaoSocial(solicitacao.getRazaoSocial());
        loja.setNome(solicitacao.getNome());
        loja.setEmail(solicitacao.getEmail());
        loja.setCnpj(solicitacao.getCnpj());

        loja.setCep(solicitacao.getCep());
        loja.setLogradouro(solicitacao.getLogradouro());
        loja.setNumero(solicitacao.getNumero());
        loja.setComplemento(solicitacao.getComplemento());
        loja.setBairro(solicitacao.getBairro());
        loja.setCidade(solicitacao.getCidade());
        loja.setUf(solicitacao.getUf());
        loja.setEndereco(solicitacao.getEndereco());

        loja.setDescricao(solicitacao.getDescricao());

        loja.setLatitude(solicitacao.getLatitude());
        loja.setLongitude(solicitacao.getLongitude());

        Loja lojaCriada = lojaRepository.save(loja);

        usuario.setTipoUsuario("Vendedor");
        usuarioRepository.save(usuario);

        solicitacaoRepository.delete(solicitacao);

        return lojaCriada;
    }

    public SolicitacaoLoja buscarPorUsuario(Long idUsuario) {
        return solicitacaoRepository.findByUsuarioId(idUsuario)
                .orElse(null);
    }

    public void deletar(Long idSolicitacao) {
        if (!solicitacaoRepository.existsById(idSolicitacao)) {
            throw new RuntimeException("Solicitação não encontrada.");
        }

        solicitacaoRepository.deleteById(idSolicitacao);
    }

    private void validarCamposObrigatorios(SolicitacaoLojaDTO dto) {
        if (dto.getIdUsuario() == null) {
            throw new RuntimeException("Usuário obrigatório.");
        }

        if (
                campoVazio(dto.getRazaoSocial()) ||
                        campoVazio(dto.getNome()) ||
                        campoVazio(dto.getEmail()) ||
                        campoVazio(dto.getCnpj()) ||
                        campoVazio(dto.getCep()) ||
                        campoVazio(dto.getLogradouro()) ||
                        campoVazio(dto.getNumero()) ||
                        campoVazio(dto.getBairro()) ||
                        campoVazio(dto.getCidade()) ||
                        campoVazio(dto.getUf())
        ) {
            throw new RuntimeException("Preencha todos os campos obrigatórios. Apenas descrição e complemento são opcionais.");
        }

        if (dto.getCnpj().length() != 14) {
            throw new RuntimeException("CNPJ inválido.");
        }

        if (dto.getCep().length() != 8) {
            throw new RuntimeException("CEP inválido.");
        }

        if (!dto.getEmail().contains("@") || !dto.getEmail().contains(".")) {
            throw new RuntimeException("E-mail inválido.");
        }
    }

    private boolean campoVazio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}