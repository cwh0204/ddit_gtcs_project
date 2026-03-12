package kr.or.gtcs.aidoccheck.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.dto.AiDocCheckDTO;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class AiDocCheckMapperTest {

    @Autowired
    private AiDocCheckMapper mapper;

    @Test
    @Transactional 
    @Rollback(false)
    void insertAiDocCheckTest() {
        // 필드 타입과 추가된 컬럼을 반영한 더미 데이터 생성
        AiDocCheckDTO dto = AiDocCheckDTO.builder()
                .docNumber("IMP-20260204-000001") // 실제 DB에 있는 수입신고번호
                .riskScore(88)                    // Integer 타입이므로 정수로 변경
                .riskResult("RED")
                .docScore(70)
                .docComment("서류상의 단가와 실제 시장 단가의 차이가 큼") // 추가된 컬럼
                .riskComment("과세 가격 저가 신고 위험군으로 분류됨")    // 추가된 컬럼
                .build();
        
        log.info("테스트 데이터 준비 완료: {}", dto);
        
        int result = mapper.insertAiDocCheck(dto);

        log.info("인서트 결과: {} (1이면 성공)", result);
        // 만약 매퍼 XML에서 selectKey를 설정했다면 아래에서 확인 가능합니다.
        log.info("생성된 체크 ID: {}", dto.getCheckId()); 
    }
}