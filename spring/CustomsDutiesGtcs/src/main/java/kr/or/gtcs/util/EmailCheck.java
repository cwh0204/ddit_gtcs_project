package kr.or.gtcs.util;

import java.util.UUID;


import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;

@Component
public class EmailCheck {
	
	private final JavaMailSender mailSender;
	
	public EmailCheck(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	/**
	 * @param to 받는사람
	 * @param subject 메일 제목
	 * @param text 메일 내용
	 */
	public void emailCheck(String to, String subject, String text) {
		
		MimeMessage message = mailSender.createMimeMessage();
        try {
        	MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        	helper.setTo(to);              // 받는 사람
        	helper.setSubject(subject);     // 제목
        	helper.setText(text, true);           // 내용
        	helper.setFrom("wonhyo.970204@gmail.com"); // 보내는 사람 (설정과 일치해야 함)
        	mailSender.send(message);
        }catch (Exception e) {
			// TODO: handle exception
		}
	}
	
	/** 
	 * 이메일 인증코드 6자리
	 */
	public String sendEmailCode(String to) {
		UUID ui = UUID.randomUUID() ; 
		String randomNumber = ui.toString().replace("-", ""); 
		String code = randomNumber.substring(0, 6).toUpperCase();
		String subject = "[G-TCS] 회원가입 이메일 인증코드 안내";
		String username = to.substring(0, to.indexOf("@"));
		String content = "<div style='font-family: sans-serif; line-height: 1.6; color: #333;'>"
                + "  <p>안녕하세요, <strong>" + username + "</strong>님!</p>"
                + "  <p>G-TCS 서비스 이용을 위한 이메일 인증 코드가 발급되었습니다.</p>"
                + "  <p>아래의 인증 코드를 진행 중인 화면에 입력하여 주시기 바랍니다.</p>"
                + "  <div style='margin: 30px 0; padding: 30px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; text-align: center;'>"
                + "     <span style='font-size: 14px; color: #666;'>인증번호</span><br>"
                + "     <strong style='font-size: 24px; color: #2c3e50; letter-spacing: 5px;'>" + code + "</strong>"
                + "  </div>"
                + "  <p style='font-size: 13px; color: #888;'>"
                + "     ※ 본 인증 코드는 보안을 위해 해당 요청에서만 유효합니다.<br>"
                + "     만약 본인이 요청하지 않았다면 이 메일을 무시해 주세요."
                + "  </p>"
                + "  <p style='margin-top: 20px;'>감사합니다.</p>"
                + "</div>";
		emailCheck(to, subject, content); 
		return code;
	}
}
