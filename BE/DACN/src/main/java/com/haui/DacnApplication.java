package com.haui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class DacnApplication {

	public static void main(String[] args) {
		SpringApplication.run(DacnApplication.class, args);
	}

}
