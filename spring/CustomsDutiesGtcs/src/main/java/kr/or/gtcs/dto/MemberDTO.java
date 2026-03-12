package kr.or.gtcs.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MemberDTO {

    // 1. MEM_ID: 시스템 내부 고유 식별자 (PK)
    private Integer memId;

    // 2. PASSWORD: 로그인 비밀번호 (암호화 필수)
    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, max = 256)
    private String password;

    // 3. MEM_NAME: 성명/상호
    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 100)
    private String memName;

    // 4. EMAIL: 이메일 주소
    @NotBlank(message = "이메일은 필수입니다.")
    @Email
    @Size(max = 100)
    private String email;

    // 5. HP_NO: 휴대전화 번호
    @NotBlank(message = "휴대전화 번호는 필수입니다.")
    @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$")
    @Size(max = 50)
    private String hpNo;

    // 6. REP_TEL_NO: 전화번호(내선)
    @NotBlank(message = "내선 전화번호는 필수입니다.")
    @Size(max = 50)
    private String repTelNo;

    // 7. COMPANY_NAME: 회사명
    @NotBlank(message = "회사명은 필수입니다.")
    @Size(max = 100)
    private String companyName;

    // 8. REP_NAME: 기업 대표자명
    @NotBlank(message = "대표자명은 필수입니다.")
    @Size(max = 50)
    private String repName;

    // 9. ZIP_CODE: 우편번호
    @NotBlank(message = "우편번호는 필수입니다.")
    @Pattern(regexp = "^\\d{5}$")
    @Size(max = 10)
    private String zipCode;

    // 10. ADDRESS: 기본 주소
    @NotBlank(message = "기본 주소는 필수입니다.")
    @Size(max = 200)
    private String address;

    // 11. ADDRESS_DETAIL: 상세 주소
    @NotBlank(message = "상세 주소는 필수입니다.")
    @Size(max = 200)
    private String addressDetail;

    // 12. CUSTOMS_ID_NO: 통관고유부호
    @NotBlank(message = "통관고유부호는 필수입니다.")
    @Pattern(regexp = "^P\\d{12}$")
    @Size(max = 50)
    private String customsIdNo;

    // 13. EMERGENCY_CONTACT: 비상 연락망 (NULL 허용으로 발리데이터 제외)
    @Size(max = 50)
    private String emergencyContact;

    // 14. DEL_YN: 회원 탈퇴 여부 (Default 'N')
    @Pattern(regexp = "[YN]")
    private String delYn;

    // 15. REG_DATE: 회원 가입 일시
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate regDate;

    // 16. MOD_DATE: 최근 정보 수정 일시
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate modDate;

    // 17. LOGIN_ID: 사용자 로그인 아이디 (Unique)
    @NotBlank(message = "아이디는 필수입니다.")
    @Size(max = 50)
    private String loginId;

    // 18. MEM_ROLE: 권한 (Default 'SHIPPER')
    private String memRole;

    // 19. BIZ_REG_NO: 사업자등록번호
    @NotBlank(message = "사업자등록번호는 필수입니다.")
    @Pattern(regexp = "^\\d{10}$")
    @Size(max = 20)
    private String bizRegNo;
    
    private Integer taskLoad;
}