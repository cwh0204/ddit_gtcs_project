package kr.or.gtcs.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiDocCheckDTO {
	
	private String checkId;
	private Integer riskScore;
	private String riskResult;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private LocalDate checkDate;
	private String docNumber;
	private Integer docScore;
	private String docComment;
	private String riskComment;
	
	

}
