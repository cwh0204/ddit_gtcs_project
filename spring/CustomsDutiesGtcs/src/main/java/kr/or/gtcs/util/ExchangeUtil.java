package kr.or.gtcs.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ExchangeUtil {
	
	@Value("${bok.api.key}")
	private String AUTH_KEY;
	
	public List<Map<String, Object>> findExchangeRate() {
	    List<Map<String, Object>> exchangeList = new ArrayList<>();
	    Map<String, String> countryMap = new LinkedHashMap<>();
	    
	    countryMap.put("미국 (USD)", "0000001");
	    countryMap.put("일본 (JPY 100)", "0000002");
	    countryMap.put("유럽연합 (EUR)", "0000003");
	    countryMap.put("중국 (CNY)", "0000053");
	    countryMap.put("영국 (GBP)", "0000012");
	    countryMap.put("홍콩 (HKD)", "0000015");
	    countryMap.put("캐나다 (CAD)", "0000013");
	    countryMap.put("호주 (AUD)", "0000017");
	    countryMap.put("스위스 (CHF)", "0000014");
	    countryMap.put("싱가포르 (SGD)", "0000024");

	    RestTemplate restTemplate = new RestTemplate();
	    ObjectMapper mapper = new ObjectMapper();
	    
	    LocalDate today = LocalDate.now();
	    String endDate = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
	    String startDate = today.minusDays(7).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

	    for (Map.Entry<String, String> entry : countryMap.entrySet()) {
	        String name = entry.getKey();
	        String code = entry.getValue();
	        
	        String url = String.format(
	            "https://ecos.bok.or.kr/api/StatisticSearch/%s/json/kr/1/5/731Y001/D/%s/%s/%s", 
	            AUTH_KEY, startDate, endDate, code
	        );

	        try {
	            String response = restTemplate.getForObject(url, String.class);
	            JsonNode root = mapper.readTree(response);
	            JsonNode rows = root.path("StatisticSearch").path("row");

	            if (rows.isArray() && rows.size() >= 2) {
	                List<JsonNode> nodeList = new ArrayList<>();
	                rows.forEach(nodeList::add);
	                nodeList.sort((a, b) -> b.path("TIME").asText().compareTo(a.path("TIME").asText()));

	                JsonNode todayRow = nodeList.get(0);
	                JsonNode yesterdayRow = nodeList.get(1);

	                double todayPrice = todayRow.path("DATA_VALUE").asDouble();
	                double yesterdayPrice = yesterdayRow.path("DATA_VALUE").asDouble();
	                
	                double diff = todayPrice - yesterdayPrice;
	                
	                Map<String, Object> map = new HashMap<>();
	                map.put("name", name);
	                map.put("todayPrice", String.format("%.2f", todayPrice));
	                map.put("yesterdayPrice", String.format("%.2f", yesterdayPrice));
	                map.put("diff", String.format("%.2f", Math.abs(diff)));
	                map.put("status", diff > 0 ? "UP" : (diff < 0 ? "DOWN" : "SAME"));
	                map.put("date", todayRow.path("TIME").asText());
	                
	                exchangeList.add(map);
	            }
	        } catch (Exception e) {
	            System.err.println(name + " 처리 중 오류: " + e.getMessage());
	        }
	    }
	    return exchangeList;
	}
}
