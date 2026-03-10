package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teste")
public class EmailControllerTeste {

    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public String testarEmail(){

        emailService.enviarEmail(
                "xa86398@gmail.com",
                "Teste de Email",
                "Funcionou!"
        );

        return "Email enviado";
    }
}
