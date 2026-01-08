package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.service.UsuarioService;
import com.Gabriel.API_Banco.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService s;

    public UsuarioController(UsuarioService s) {
        this.s = s;
    }

    @PostMapping("/registrar")
    public String registrarUsuario(@RequestBody Usuario usuario) {
        s.salvar(usuario);
        return "Usuário " + usuario.getNome() + " salvo com sucesso!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Usuario usuario) {
        // Busca email no banco, para validar primeiro o email do usuário e se ele está cadastrado
        Optional<Usuario> usuarioNoBanco = s.consultarPorEmail(usuario.getEmail());

        // Se NÃO encontrou usuário
        if (usuarioNoBanco.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado!");
        }

        //Se a validação do email der certo, ele vai pegar a senha para comparar
        String senhaNoBanco = usuarioNoBanco.get().getSenha();

        // Compara com a senha que veio no login
        if (!usuario.getSenha().equals(senhaNoBanco)) {

            // Se ela atender a condição imposta, de que não batem, devolve que a senha é inválida
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Senha inválida!");
        }

        // Se chegou até aqui, o email e a senha estão corretos!!
        // Retorna o usuário inteiro → vira JSON automaticamente
        return ResponseEntity.ok(usuarioNoBanco.get());
    }

}
