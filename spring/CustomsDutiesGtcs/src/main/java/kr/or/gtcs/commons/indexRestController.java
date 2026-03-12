package kr.or.gtcs.commons;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.or.gtcs.util.ExchangeUtil;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/index")
@RequiredArgsConstructor
public class indexRestController {
	private final ExchangeUtil exchangeUtil;
	
	@GetMapping("/exchange")
	@ResponseBody
	public List<Map<String, Object>> ExchangeRate() {
		return exchangeUtil.findExchangeRate();
	}
}
