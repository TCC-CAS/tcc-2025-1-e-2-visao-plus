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

    public void recuperacaoSenha(String para, String link, String senhaTemporaria) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(para);
        message.setSubject("Recuperação de senha - VisionPlus+");

        message.setText(
                "Olá!\n\n" +
                        "Recebemos uma solicitação de recuperação de senha para sua conta na VisionPlus+.\n\n" +
                        "Sua senha temporária é:\n\n" +
                        senhaTemporaria + "\n\n" +
                        "Use essa senha para acessar sua conta e, se desejar, altere sua senha depois.\n\n" +
                        "Link de acesso:\n" +
                        link + "\n\n" +
                        "Caso você não tenha solicitado essa recuperação, ignore este e-mail."
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
                        "Estaremos acompanhando, para garantir de que seu pedido seja atendido " +
                        "até o prazo: " +cotacao.getDataResposta().format(formatter) + ".\n" +
                        "Caso tenha algum comentário ou observação, sinta-se à vontade para usar o chat da cotação!\n"+
                        "Muito obrigado, novamente, por confiar na VisionPlus+!"
        );

        mailSender.send(message);

    }

    public void respostaCotacao(Cotacao cotacao){

        SimpleMailMessage message = new SimpleMailMessage();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        message.setTo(cotacao.getUsuario().getEmail());
        message.setSubject("Cotação Respondida!");

        message.setText(
                "Olá, "+ cotacao.getUsuario().getNome() +"!\n\n" +
                        "Informamos que a sua cotação para a loja " + cotacao.getLoja().getNome() + " foi respondida! \n"+
                        "Venha conferir o status da sua cotação!\n" +
                        "Muito obrigado por confiar na VisionPlus+!"
        );

        mailSender.send(message);

    }


}