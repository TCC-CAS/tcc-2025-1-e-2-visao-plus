package com.Gabriel.API_Banco.service;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.Repositorio;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final Repositorio r;

    public UsuarioService(Repositorio r){
        this.r = r;
    }

    public Usuario salvar(Usuario usuario) {
        return r.save(usuario);
    }


}
