package com.Gabriel.API_Banco.service;
import com.Gabriel.API_Banco.model.Cotacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmail(String para, String assunto, String texto) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(para);
        message.setSubject(assunto);
        message.setText(texto);

        mailSender.send(message);
    }

    public void recuperacaoSenha(String para, String Link, String senha){

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(para);
        message.setSubject("Perdeu sua senha?");

        message.setText(
                "Olá!\n\n" +
                        "Olá! Vimos que você esqueceu sua senha. Devido a isso viemos relembrá-la:\n" +
                        senha +
                        "Caso queira redefinir ela, clique no link abaixo:\n" +
                        Link
        );

        mailSender.send(message);
    }

    public void criacaoDeCotacao(Cotacao cotacao){

        SimpleMailMessage message = new SimpleMailMessage();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        message.setTo(cotacao.getUsuario().getEmail());
        message.setSubject("Cotação Enviada!");

        message.setText(
                "Olá, "+ cotacao.getUsuario().getNome() +"!\n\n" +
                        "Obrigado por utilizar da VisionPlus+ para realizar uma cotação!\n" +
                        "Até o prazo: " +cotacao.getDataResposta().format(formatter) +
                        "Estaremos acompanhando, para garantir de que seu pedido seja atendido!\n" +
                        "Caso tenha algum comentário ou observação, sinta-se à vontade para usar o chat da cotação!\n"+
                        "Muito obrigado, novamente, por confiar na VisionPlus+!"
        );

        mailSender.send(message);

    }


}