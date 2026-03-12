package kr.or.gtcs.commons;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.gtcs.util.AiDateEngine;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rest/ai")
@RequiredArgsConstructor
public class AiInferenceController {
	private final AiDateEngine aiEngine;
	
	@GetMapping("/hscode")
	public String findHsCode(
			@RequestParam String partOrFinished,
		    @RequestParam String itemName,
		    @RequestParam String material,
		    @RequestParam String usage
	) {
		String formattedMessage = String.format(
		        "품목 상태: %s, 품목명: %s, 재질: %s, 용도: %s",
		        partOrFinished, itemName, material, usage
		);
		return aiEngine.hsCondeCreate(formattedMessage);
	}
}
