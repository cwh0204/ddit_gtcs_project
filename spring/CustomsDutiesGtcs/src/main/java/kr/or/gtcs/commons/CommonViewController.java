package kr.or.gtcs.commons;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class CommonViewController {
	
	
	
	@GetMapping("/{role}/{task}/{subtask}/{action}")
    public String simpleRoute(
    		@PathVariable String role,
    		@PathVariable String task,
    		@PathVariable String subtask,
    		@PathVariable String action
    		)
	{
//        return "/" + role + "/" + task + "/" + subtask + "/" + action; 
		return role + "/" + task + "/" + subtask + "/" + action; // 시큐리티 규정
    }
}
