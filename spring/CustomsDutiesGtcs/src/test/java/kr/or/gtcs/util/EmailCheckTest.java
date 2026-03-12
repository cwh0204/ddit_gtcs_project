package kr.or.gtcs.util;

import static org.junit.jupiter.api.Assertions.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class EmailCheckTest {

	@Autowired
	EmailCheck emailCheck;

	@Test
	void test() {
		emailCheck.emailCheck("suminiu20@naver.com", "숨 비밀번호 해킹함", "중고나라 사기칠거임");
	}

	@Test
	@DisplayName("security 암호화")
	void suminEnc() {
		String suminPassd = "12345";
		// 암호화시켜서 못 알아보게

		PasswordEncoder passEncoder = new BCryptPasswordEncoder();
		String encCode = passEncoder.encode(suminPassd); // db 사용자 테이블 암호 컬럼에 이 값을 저장
		boolean sameChk = passEncoder.matches("5234", encCode); // 사용자 입력과 비교할 때

		log.info("암호화된 값 {}", encCode);

		assertEquals(true, sameChk);

	}

	@Test
	void test1() {

		String AUTH_KEY = "7J283JAYZ8LKWPN35HJA";
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
        String startDate = today.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        for (String name : countryMap.keySet()) {
            String code = countryMap.get(name);
            String url = String.format(
                "https://ecos.bok.or.kr/api/StatisticSearch/%s/json/kr/1/2/731Y001/D/%s/%s/%s", 
                AUTH_KEY, startDate, endDate, code
            );

            try {
                String response = restTemplate.getForObject(url, String.class);
                JsonNode root = mapper.readTree(response);
                JsonNode rows = root.path("StatisticSearch").path("row");

                if (rows.isArray() && rows.size() >= 2) {
                    // 한국은행 API 특성상 0번이 과거, 1번이 최신 데이터인 경우가 많습니다
                    JsonNode row1 = rows.get(0);
                    JsonNode row2 = rows.get(1);

                    // 날짜 비교를 통해 오늘(최신)과 어제를 정확히 구분
                    JsonNode todayRow = row1.path("TIME").asInt() > row2.path("TIME").asInt() ? row1 : row2;
                    JsonNode yesterdayRow = row1.path("TIME").asInt() > row2.path("TIME").asInt() ? row2 : row1;

                    double todayPrice = todayRow.path("DATA_VALUE").asDouble();
                    double yesterdayPrice = yesterdayRow.path("DATA_VALUE").asDouble();
                    double diff = todayPrice - yesterdayPrice;
                    String formattedDiff = String.format("%.2f", Math.abs(diff));
                    String formattedToday = String.format("%.2f", todayPrice);
                    String formattedYesterday = String.format("%.2f", todayPrice);
                    
                    // 개별 국가 정보를 Map에 저장
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", name);                        // 국가명
                    map.put("todayPrice", formattedToday);            // 오늘 가격
                    map.put("yesterdayPrice", formattedYesterday);    // 어제 가격
                    map.put("diff", formattedDiff);              // 변동폭
                    map.put("status", diff > 0 ? "UP" : (diff < 0 ? "DOWN" : "SAME")); // 상태
                    map.put("date", todayRow.path("TIME").asText()); // 기준 날짜
                    exchangeList.add(map);
                }
            } catch (Exception e) {
                System.err.println(name + " 데이터 처리 실패: " + e.getMessage());
            }
        }
        log.info(exchangeList.toString());
	}
}
