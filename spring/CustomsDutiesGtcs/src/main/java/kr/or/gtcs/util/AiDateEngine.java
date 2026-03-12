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
	            + "[1. 핵심 평가 항목]\n"
	            + "- 논리적 일관성: 중량(Net/Total), 날짜 흐름(인보이스->입항->반입), 금액(단가x수량=총액) 간의 수치적 모순 여부\n"
	            + "- 규정 준수: 품명과 HS코드의 정확한 일치 여부, 원산지 증명서 유무에 따른 협정관세 적용의 적법성\n"
	            + "- 위험 징후: 통상적인 시장가 대비 지나치게 낮거나 높은 신고가(Under/Over-valuing), 우범 국가 거래 여부\n\n"
	            + "[2. docScore 부여 및 판정 기준 (매우 중요)]\n"
	            + "분석 결과에 따라 서류의 상태를 4가지로 분류하고, 반드시 지정된 구간 내에서 docScore를 부여하십시오.\n"
	            + "▶ 수리 (docScore: 95~100): 모든 수치와 계산이 완벽하게 일치하며, 결함이나 위험 징후가 전혀 없는 완벽한 상태.\n"
	            + "▶ 심사 (docScore: 85~94): 치명적 오류는 없으나, 가격 의심이나 증명서 확인 등 세관 직원의 추가적인 육안 검토가 필요한 상태.\n"
	            + "▶ 보완정정 (docScore: 50~84): 명백한 계산 오류, 날짜 모순 등으로 신고인에게 서류 수정을 요구해야 하는 상태. (※ 단, HS코드와 품명이 일치하지 않을 경우 반드시 50 초과 70 미만의 점수를 부여할 것)\n"
	            + "▶ 반려 (docScore: 0~49): 통관이 불가한 치명적 결함 및 법적 위반 상태. (※ 단, 원산지가 'KP'(북한) 등 수출입 제재 국가인 경우 반드시 15 미만의 점수를 부여할 것)\n\n"
	            + "[3. 출력 형식]\n"
	            + "결과는 반드시 아래의 JSON 형식으로만 답변하고, 마크다운(```json)이나 다른 설명은 절대 추가하지 마세요.\n"
	            + "{\n"
	            + "  \"docScore\": 0-100 사이의 숫자,\n"
	            + "  \"docComment\": \"[판정결과(예: 보완정정)] 데이터 정합성 및 결함에 대한 구체적 분석 의견\",\n"
	            + "  \"riskScore\": 0-100 사이의 숫자 (높을수록 외환/안보 고위험),\n"
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
