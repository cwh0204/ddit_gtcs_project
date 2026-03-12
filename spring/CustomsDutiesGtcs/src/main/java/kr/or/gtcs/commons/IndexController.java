package kr.or.gtcs.commons;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class IndexController {

	@GetMapping("/")
	public String index(Authentication auth) {
		SecurityContext secContext = SecurityContextHolder.getContext(); 
		log.info("체킁: {}",secContext);
		
		log.info("체킁: {}",auth);
		return "index";
	}
}
