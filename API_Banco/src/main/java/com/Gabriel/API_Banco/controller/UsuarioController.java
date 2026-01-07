package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.service.UsuarioService;
import com.Gabriel.API_Banco.service.UsuarioService;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService s;

    public UsuarioController(UsuarioService s){
        this.s = s;
    }

    @PostMapping("/registrar")
    public String registrarUsuario(@RequestBody Usuario usuario){
        s.salvar(usuario);
        return "Usuário " + usuario.getNome() + " salvo com sucesso!";
    }

    @PostMapping("/login")
    public String loginUsuario(@RequestBody Usuario usuario){
        Optional<Usuario> usuarioNoBanco = s.consultarPorEmail(usuario.getEmail());

        if(usuarioNoBanco.isPresent()){
            String senhaNoBanco = usuarioNoBanco.get().getSenha();

            // Compara com a senha que veio no login
            if(usuario.getSenha().equals(senhaNoBanco)){
                return "Login realizado com sucesso!";
            } else {
                return "Senha inválida!";
            }
        }else{
            return "Usuário não encontrado!";
        }
    }

}
