package com.Gabriel.API_Banco.service;
import java.util.Optional;

import com.Gabriel.API_Banco.dto.EditarUsuarioDTO;
import org.springframework.stereotype.Service;

import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;

@Service
public class UsuarioService {

    private final UsuarioRepositorio r;

    public UsuarioService(UsuarioRepositorio r){
        this.r = r;
    }

    public Usuario salvar(Usuario usuario) {
        return r.save(usuario);
    }

    public Optional<Usuario> consultarPorEmail(String email) {
        return r.findByEmail(email);
    }

    public Usuario editarUsuario (EditarUsuarioDTO dto){

        Usuario usuario = r.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        return r.save(usuario);
    }


}
