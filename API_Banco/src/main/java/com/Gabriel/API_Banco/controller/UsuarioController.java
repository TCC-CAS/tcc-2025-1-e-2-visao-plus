package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.service.UsuarioService;
import com.Gabriel.API_Banco.service.UsuarioService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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

}
