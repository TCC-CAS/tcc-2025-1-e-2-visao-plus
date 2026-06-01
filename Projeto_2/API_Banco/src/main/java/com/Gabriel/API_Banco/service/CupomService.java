package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.AplicarCupomDTO;
import com.Gabriel.API_Banco.dto.CriarCupomDTO;
import com.Gabriel.API_Banco.dto.EditarCupomDTO;
import com.Gabriel.API_Banco.dto.EnviarCupomUsuariosDTO;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.model.Cupom;
import com.Gabriel.API_Banco.model.CupomUsuario;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.model.enums.PlanoLoja;
import com.Gabriel.API_Banco.model.enums.StatusCotacao;
import com.Gabriel.API_Banco.model.enums.StatusCupomUsuario;
import com.Gabriel.API_Banco.model.enums.TipoDesconto;
import com.Gabriel.API_Banco.repository.CotacaoRepositorio;
import com.Gabriel.API_Banco.repository.CupomRepositorio;
import com.Gabriel.API_Banco.repository.CupomUsuarioRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CupomService {

    private final CupomRepositorio cupomRepo;
    private final CupomUsuarioRepositorio cupomUsuarioRepo;
    private final LojaRepositorio lojaRepo;
    private final UsuarioRepositorio usuarioRepo;
    private final CotacaoRepositorio cotacaoRepo;
    private final EmailService emailService;

    public CupomService(
            CupomRepositorio cupomRepo,
            CupomUsuarioRepositorio cupomUsuarioRepo,
            LojaRepositorio lojaRepo,
            UsuarioRepositorio usuarioRepo,
            CotacaoRepositorio cotacaoRepo,
            EmailService emailService
    ) {
        this.cupomRepo = cupomRepo;
        this.cupomUsuarioRepo = cupomUsuarioRepo;
        this.lojaRepo = lojaRepo;
        this.usuarioRepo = usuarioRepo;
        this.cotacaoRepo = cotacaoRepo;
        this.emailService = emailService;
    }

    public Cupom criar(CriarCupomDTO dto) {
        Loja loja = lojaRepo.findById(dto.getIdLoja())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        validarDadosCupom(dto.getCodigo(), dto.getTipoDesconto(), dto.getValorDesconto(), dto.getDataValidade());

        validarDescricaoCupom(dto.getDescricao());

        if (cupomRepo.existsByLojaIdAndCodigoIgnoreCaseAndDeletadoFalse(loja.getId(), dto.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe um cupom com esse código nesta loja.");
        }

        validarQuantidadePorPlano(loja, dto.getQuantidadeTotal());

        Cupom cupom = new Cupom();
        cupom.setLoja(loja);
        cupom.setCodigo(dto.getCodigo().trim().toUpperCase());
        cupom.setDescricao(dto.getDescricao() != null ? dto.getDescricao().trim() : null);
        cupom.setTipoDesconto(dto.getTipoDesconto());
        cupom.setValorDesconto(dto.getValorDesconto());
        cupom.setDataInicio(dto.getDataInicio() != null ? dto.getDataInicio() : LocalDateTime.now());
        cupom.setDataValidade(dto.getDataValidade());
        cupom.setQuantidadeTotal(dto.getQuantidadeTotal());
        cupom.setAtivo(false);
        cupom.setPublico(false);
        cupom.setDeletado(false);
        cupom.setQuantidadeResgatada(0);
        cupom.setQuantidadeUsada(0);
        cupom.setCriadoEm(LocalDateTime.now());

        return cupomRepo.save(cupom);
    }

    public List<Cupom> listarPorLoja(Long idLoja) {
        return cupomRepo.findByLojaIdAndDeletadoFalseOrderByCriadoEmDesc(idLoja);
    }

    public Map<String, Object> resumoPorLoja(Long idLoja) {
        List<Cupom> cupons = listarPorLoja(idLoja);

        long ativos = cupons.stream().filter(c -> Boolean.TRUE.equals(c.getAtivo())).count();
        long publicos = cupons.stream().filter(c -> Boolean.TRUE.equals(c.getPublico())).count();
        long vencidos = cupons.stream().filter(c -> c.getDataValidade().isBefore(LocalDateTime.now())).count();

        int resgatados = cupons.stream()
                .mapToInt(c -> c.getQuantidadeResgatada() == null ? 0 : c.getQuantidadeResgatada())
                .sum();

        int usados = cupons.stream()
                .mapToInt(c -> c.getQuantidadeUsada() == null ? 0 : c.getQuantidadeUsada())
                .sum();

        Map<String, Object> resumo = new HashMap<>();
        resumo.put("total", cupons.size());
        resumo.put("ativos", ativos);
        resumo.put("publicos", publicos);
        resumo.put("vencidos", vencidos);
        resumo.put("resgatados", resgatados);
        resumo.put("usados", usados);

        return resumo;
    }

    public Cupom editar(Long idCupom, EditarCupomDTO dto) {
        Cupom cupom = buscarCupom(idCupom);

        validarDadosCupom(dto.getCodigo(), dto.getTipoDesconto(), dto.getValorDesconto(), dto.getDataValidade());
        validarDescricaoCupom(dto.getDescricao());
        validarQuantidadePorPlano(cupom.getLoja(), dto.getQuantidadeTotal());

        cupom.setCodigo(dto.getCodigo().trim().toUpperCase());
        cupom.setDescricao(dto.getDescricao() != null ? dto.getDescricao().trim() : null);
        cupom.setTipoDesconto(dto.getTipoDesconto());
        cupom.setValorDesconto(dto.getValorDesconto());
        cupom.setDataInicio(dto.getDataInicio());
        cupom.setDataValidade(dto.getDataValidade());
        cupom.setQuantidadeTotal(dto.getQuantidadeTotal());

        return cupomRepo.save(cupom);
    }

    public Cupom ativarPublico(Long idCupom) {
        Cupom cupom = buscarCupom(idCupom);

        validarPodeAtivar(cupom);

        cupom.setAtivo(true);
        cupom.setPublico(true);

        return cupomRepo.save(cupom);
    }

    public Cupom desativar(Long idCupom) {
        Cupom cupom = buscarCupom(idCupom);

        cupom.setAtivo(false);
        cupom.setPublico(false);

        return cupomRepo.save(cupom);
    }

    public void deletarLogico(Long idCupom) {
        Cupom cupom = buscarCupom(idCupom);

        cupom.setAtivo(false);
        cupom.setPublico(false);
        cupom.setDeletado(true);

        cupomRepo.save(cupom);
    }

    public List<Cupom> listarPublicosDaLoja(Long idLoja) {
        return cupomRepo.findByLojaIdAndAtivoTrueAndPublicoTrueAndDeletadoFalseAndDataValidadeAfter(
                idLoja,
                LocalDateTime.now()
        );
    }

    public List<Cupom> listarGlobais() {
        return cupomRepo.findByAtivoTrueAndPublicoTrueAndDeletadoFalseAndDataValidadeAfter(
                LocalDateTime.now()
        );
    }

    public CupomUsuario resgatar(Long idCupom, Long idUsuario) {
        Cupom cupom = buscarCupom(idCupom);

        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (usuario.getTipoUsuario() == null || !usuario.getTipoUsuario().equalsIgnoreCase("Comum")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Somente usuários consumidores podem resgatar cupons."
            );
        }

        validarCupomDisponivelParaResgate(cupom);

        if (cupomUsuarioRepo.existsByCupomIdAndUsuarioId(idCupom, idUsuario)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você já resgatou este cupom.");
        }

        long cuponsAtivosUsuario = cupomUsuarioRepo.countByUsuarioIdAndStatus(idUsuario, StatusCupomUsuario.RESGATADO);

        if (cuponsAtivosUsuario >= 5) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Você já possui 5 cupons ativos. Use ou remova algum cupom antes de resgatar outro."
            );
        }

        CupomUsuario cupomUsuario = new CupomUsuario();
        cupomUsuario.setCupom(cupom);
        cupomUsuario.setUsuario(usuario);
        cupomUsuario.setStatus(StatusCupomUsuario.RESGATADO);
        cupomUsuario.setResgatadoEm(LocalDateTime.now());

        cupom.setQuantidadeResgatada(cupom.getQuantidadeResgatada() + 1);

        cupomRepo.save(cupom);
        return cupomUsuarioRepo.save(cupomUsuario);
    }

    public List<CupomUsuario> listarCuponsDoUsuario(Long idUsuario) {
        return cupomUsuarioRepo.findByUsuarioIdOrderByResgatadoEmDesc(idUsuario);
    }

    public Cotacao aplicarCupomNaCotacao(Long idCotacao, AplicarCupomDTO dto) {
        Cotacao cotacao = cotacaoRepo.findById(idCotacao)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cotação não encontrada"));

        CupomUsuario cupomUsuario = cupomUsuarioRepo.findById(dto.getIdCupomUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom do usuário não encontrado"));

        if (!cotacao.getUsuario().getId().equals(dto.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Essa cotação não pertence a este usuário.");
        }

        if (!cupomUsuario.getUsuario().getId().equals(dto.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esse cupom não pertence a este usuário.");
        }

        if (cupomUsuario.getStatus() != StatusCupomUsuario.RESGATADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esse cupom não está disponível para uso.");
        }

        Cupom cupom = cupomUsuario.getCupom();

        if (!cupom.getLoja().getId().equals(cotacao.getLoja().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esse cupom não pertence à loja desta cotação.");
        }

        if (cupom.getDataValidade().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esse cupom está vencido.");
        }

        if (cotacao.getStatus() != StatusCotacao.PROPOSTA_ENVIADA &&
                cotacao.getStatus() != StatusCotacao.APROVADA &&
                cotacao.getStatus() != StatusCotacao.AGUARDANDO_SINAL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cupom só pode ser aplicado após a loja enviar uma proposta."
            );
        }

        BigDecimal valorOriginal = cotacao.getValorFinal();

        if (valorOriginal == null || valorOriginal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A cotação ainda não possui valor final.");
        }

        BigDecimal valorDesconto = calcularDesconto(cupom, valorOriginal);
        BigDecimal novoValorFinal = valorOriginal.subtract(valorDesconto);

        if (novoValorFinal.compareTo(BigDecimal.ZERO) < 0) {
            novoValorFinal = BigDecimal.ZERO;
        }

        cotacao.setValorOriginal(valorOriginal);
        cotacao.setValorDesconto(valorDesconto);
        cotacao.setValorFinal(novoValorFinal);
        cotacao.setCupomAplicado(cupomUsuario);

        cupomUsuario.setStatus(StatusCupomUsuario.USADO);
        cupomUsuario.setUsadoEm(LocalDateTime.now());
        cupomUsuario.setCotacao(cotacao);

        cupom.setQuantidadeUsada(cupom.getQuantidadeUsada() + 1);

        cupomRepo.save(cupom);
        cupomUsuarioRepo.save(cupomUsuario);

        return cotacaoRepo.save(cotacao);
    }

    public void enviarParaUsuarios(Long idCupom, EnviarCupomUsuariosDTO dto) {
        Cupom cupom = buscarCupom(idCupom);

        validarPodeAtivar(cupom);
        validarCupomDisponivelParaResgate(cupom);

        cupom.setAtivo(true);

        for (String email : dto.getEmails()) {
            String emailLimpo = email.trim();

            usuarioRepo.findByEmail(emailLimpo).ifPresent(usuario -> {
                if (cupomUsuarioRepo.existsByCupomIdAndUsuarioId(cupom.getId(), usuario.getId())) {
                    return;
                }

                Integer total = cupom.getQuantidadeTotal();
                Integer resgatada = cupom.getQuantidadeResgatada() == null ? 0 : cupom.getQuantidadeResgatada();

                if (total != null && resgatada >= total) {
                    return;
                }

                CupomUsuario cupomUsuario = new CupomUsuario();
                cupomUsuario.setCupom(cupom);
                cupomUsuario.setUsuario(usuario);
                cupomUsuario.setStatus(StatusCupomUsuario.RESGATADO);
                cupomUsuario.setResgatadoEm(LocalDateTime.now());

                cupomUsuarioRepo.save(cupomUsuario);

                cupom.setQuantidadeResgatada(resgatada + 1);

                try {
                    // Depois a gente encaixa o método real do seu EmailService.
                    // emailService.enviarCupomParaUsuario(usuario, cupom);
                    System.out.println("Cupom " + cupom.getCodigo() + " enviado para " + usuario.getEmail());
                } catch (Exception e) {
                    System.err.println("Erro ao enviar e-mail para " + usuario.getEmail());
                }
            });
        }

        cupomRepo.save(cupom);
    }

    private Cupom buscarCupom(Long idCupom) {
        Cupom cupom = cupomRepo.findById(idCupom)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado"));

        if (Boolean.TRUE.equals(cupom.getDeletado())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado");
        }

        return cupom;
    }

    private void validarDadosCupom(String codigo, TipoDesconto tipo, BigDecimal valor, LocalDateTime validade) {
        if (codigo == null || codigo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código do cupom é obrigatório.");
        }

        String codigoLimpo = codigo.trim();

        if (codigoLimpo.length() > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código do cupom deve ter no máximo 10 caracteres.");
        }

        if (tipo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de desconto é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valor do desconto deve ser maior que zero.");
        }

        if (tipo == TipoDesconto.PORCENTAGEM && valor.compareTo(new BigDecimal("100")) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desconto percentual não pode passar de 100%.");
        }

        if (validade == null || validade.isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data de validade precisa ser futura.");
        }
    }

    private void validarDescricaoCupom(String descricao) {
        if (descricao != null && descricao.trim().length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Descrição do cupom deve ter no máximo 50 caracteres.");
        }
    }

    private void validarPodeAtivar(Cupom cupom) {
        Loja loja = cupom.getLoja();

        if (loja.getPlano() == null || loja.getPlano() == PlanoLoja.FREE) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Cupons são um recurso dos planos PLUS e PRO. Faça upgrade para ativar essa feature."
            );
        }

        if (cupom.getDataValidade().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível ativar cupom vencido.");
        }

        long ativos = cupomRepo.countByLojaIdAndAtivoTrueAndDeletadoFalse(loja.getId());

        if (!Boolean.TRUE.equals(cupom.getAtivo())) {
            int limite = limiteCuponsAtivos(loja.getPlano());

            if (ativos >= limite) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Seu plano permite até " + limite + " cupons ativos."
                );
            }
        }

        validarQuantidadePorPlano(loja, cupom.getQuantidadeTotal());
    }

    private void validarQuantidadePorPlano(Loja loja, Integer quantidadeTotal) {
        PlanoLoja plano = loja.getPlano() == null ? PlanoLoja.FREE : loja.getPlano();

        if (plano == PlanoLoja.FREE && quantidadeTotal != null && quantidadeTotal > 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Plano FREE não permite cupons.");
        }

        if (plano == PlanoLoja.PLUS && quantidadeTotal != null && quantidadeTotal > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plano PLUS permite até 30 resgates por cupom.");
        }

        // PRO pode deixar null para ilimitado ou definir quantidade.
    }

    private int limiteCuponsAtivos(PlanoLoja plano) {
        if (plano == PlanoLoja.PLUS) return 5;
        if (plano == PlanoLoja.PRO) return 15;
        return 0;
    }

    private void validarCupomDisponivelParaResgate(Cupom cupom) {
        if (!Boolean.TRUE.equals(cupom.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupom inativo.");
        }

        if (cupom.getDataValidade().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupom vencido.");
        }

        Integer total = cupom.getQuantidadeTotal();

        if (total != null && cupom.getQuantidadeResgatada() >= total) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esse cupom já atingiu o limite de resgates.");
        }
    }

    private BigDecimal calcularDesconto(Cupom cupom, BigDecimal valorOriginal) {
        if (cupom.getTipoDesconto() == TipoDesconto.PORCENTAGEM) {
            return valorOriginal
                    .multiply(cupom.getValorDesconto())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        }

        return cupom.getValorDesconto().min(valorOriginal);
    }
}
