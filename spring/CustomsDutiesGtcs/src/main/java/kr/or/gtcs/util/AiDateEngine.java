package kr.or.gtcs.util;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AiDateEngine {
	
	private final ChatClient chatClient;
	
	public String hsCondeCreate(String message) {
		
		return chatClient.prompt()
                .system("당신은 전문 관세사입니다. 제공된 물품 정보를 분석하여 HS코드를 찾으세요.\n" +
                        "### 규칙 ###\n" +
                        "1. 결과는 반드시 '0000.00.0000' 형식으로 답변하세요.\n" +
                        "2. 설명 없이 코드만 보내세요.\n" +
                        "3. 만약 제공된 정보(품목명, 재질 등)가 서로 모순되거나, 실제 존재하지 않는 물품이거나, " +
                        "HS코드를 특정하기에 데이터가 너무 부족하다면 이유를 알려주세요" +
                        "4. 답변 예시: 6109.10.1000")
                .user(message)
                .call()
                .content();
	}
	
	public <T> String aiDocAnalyzer(T dto) {
		
	    String className = dto.getClass().getSimpleName().equals("ExportMasterDTO") ? "수출신고서" : "수입신고서";
	    
	    String systemPrompt = "당신은 20년 경력의 베테랑 전문 관세사입니다. 제시된 " + className + " 데이터를 기반으로 서류의 적합성과 법적/물류적 위험도를 분석하세요.\n\n"
	            + "분석 시 다음 사항을 반드시 고려하십시오:\n"
	            + "1. 논리적 일관성: 중량(Net/Total), 날짜(입항/반입/인보이스), 금액(단가/수량/총액) 간의 수치적 모순 여부\n"
	            + "2. 규정 준수: HS코드와 품명의 일치성, 원산지 증명서 유무에 따른 협정관세 적용의 적절성\n"
	            + "3. 위험 징후: 통상적인 거래 가격보다 지나치게 낮거나 높은 신고가(Under/Over-valuing), 우범 국가 거래 여부\n\n"
	            + "결과는 반드시 아래의 JSON 형식으로만 답변하고, JSON 외의 어떠한 설명이나 텍스트도 생략하세요.\n"
	            + "{\n"
	            + "  \"docScore\": 0-100 사이의 숫자,\n"
	            + "  \"docComment\": \"데이터 정합성 및 논리적 결함에 대한 구체적 분석 의견\",\n"
	            + "  \"riskScore\": 0-100 사이의 숫자(높을수록 고위험),\n"
	            + "  \"riskComment\": \"관세법 및 외환거래법 관점에서의 구체적인 위험 근거\"\n"
	            + "}";
		
		String content = chatClient.prompt()
                .system(systemPrompt)
                .user("분석할 수입 신고 데이터 :" + dto.toString())
                .call()
                .content();
		
		if (content.contains("```json")) {
	        content = content.substring(content.indexOf("```json") + 7);
	        content = content.substring(0, content.lastIndexOf("```"));
	    } else if (content.contains("```")) {
	        content = content.substring(content.indexOf("```") + 3);
	        content = content.substring(0, content.lastIndexOf("```"));
	    }
		
		return content.trim();
	}
}
