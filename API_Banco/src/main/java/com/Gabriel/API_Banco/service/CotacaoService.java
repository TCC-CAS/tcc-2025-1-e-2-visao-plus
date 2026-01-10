package com.Gabriel.API_Banco.service;

import org.springframework.stereotype.Service;
import com.Gabriel.API_Banco.repository.CotacaoRepositorio;
import com.Gabriel.API_Banco.service.LojaService;
import com.Gabriel.API_Banco.service.UsuarioService;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Usuario;
import java.util.Optional;
import com.Gabriel.API_Banco.dto.CriarCotacaoDTO;


@Service
public class CotacaoService {

    private final CotacaoRepositorio cr;
    private final UsuarioService us;
    private final LojaService ls;

    public CotacaoService(CotacaoRepositorio cr, UsuarioService us, LojaService ls){
        this.cr = cr;
        this.us = us;
        this.ls = ls;
    }

    public Cotacao criarCotacao(CriarCotacaoDTO dto) {
        Optional<Usuario> usuarioOpt = us.consultarPorEmail(dto.getEmailUsuario());
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        Usuario usuario = usuarioOpt.get();

        Optional<Loja> lojaOpt = ls.findByEmailLoja(dto.getEmailLoja());
        if (lojaOpt.isEmpty()) {
            throw new RuntimeException("Loja não encontrada");
        }
        Loja loja = lojaOpt.get();

        Cotacao cotacao = new Cotacao();
        cotacao.setProduto(dto.getProduto());
        cotacao.setQuantidade(dto.getQuantidade());
        cotacao.setUsuario(usuario);
        cotacao.setLoja(loja);

        return cr.save(cotacao);
    }




}
