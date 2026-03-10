package com.Gabriel.API_Banco;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.util.ObjectUtils;

@SpringBootApplication
public class ApiBancoApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		System.setProperty("EMAIL_USER", dotenv.get("EMAIL_USER"));
		System.setProperty("EMAIL_PASS", dotenv.get("EMAIL_PASS"));
		System.setProperty("C_NAME", dotenv.get("C_NAME"));
		System.setProperty("C_KEY", dotenv.get("C_KEY"));
		System.setProperty("C_SECRET", dotenv.get("C_SECRET"));

		SpringApplication.run(ApiBancoApplication.class, args);
	}



}
