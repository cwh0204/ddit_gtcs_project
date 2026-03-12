package kr.or.gtcs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CustomsDutiesGtcsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomsDutiesGtcsApplication.class, args);
	}

}
