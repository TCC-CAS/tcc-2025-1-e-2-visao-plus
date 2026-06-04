package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.SolicitacaoLoja;
import com.Gabriel.API_Banco.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolicitacaoLojaRepository extends JpaRepository<SolicitacaoLoja, Long> {

    boolean existsByCnpj(String cnpj);

    boolean existsByUsuario(Usuario usuario);

    Optional<SolicitacaoLoja> findByUsuario(Usuario usuario);

    Optional<SolicitacaoLoja> findByUsuarioId(Long idUsuario);

    List<SolicitacaoLoja> findAllByOrderByDataSolicitacaoDesc();
}