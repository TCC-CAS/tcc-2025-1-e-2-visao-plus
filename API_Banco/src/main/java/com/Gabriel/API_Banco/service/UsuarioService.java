package com.Gabriel.API_Banco.service;

import java.util.List;
import java.util.Optional;

import com.Gabriel.API_Banco.dto.EditarUsuarioDTO;
import com.Gabriel.API_Banco.dto.ListarUsuariosDTO;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepositorio r;
    private final LojaRepositorio lr;

    public UsuarioService(UsuarioRepositorio r, LojaRepositorio lr) {
        this.r = r;
        this.lr = lr;
    }



    public Usuario salvar(Usuario usuario) {
        return r.save(usuario);
    }

    public Optional<Usuario> consultarPorEmail(String email) {
        return r.findByEmail(email);
    }

    public Usuario editarUsuario(EditarUsuarioDTO dto) {

        Usuario usuario = r.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        return r.save(usuario);
    }

    public List<ListarUsuariosDTO> listarUsuarios() {
        return r.findAll().stream()
                .map(usuario -> new ListarUsuariosDTO(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getEmail(),
                        usuario.getTipoUsuario()

                ))
                .toList();
    }

    @Transactional
    public void deletarUsuario(Long id) {
        Usuario usuario = r.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // Se for vendedor, deletar loja primeiro
        if (usuario.getTipoUsuario() == TipoUsuario.VENDEDOR) {

            lojaRepository.findByDonoId(id)
                    .ifPresent(lojaRepository::delete);
        }

        r.delete(usuario);
    }

}
