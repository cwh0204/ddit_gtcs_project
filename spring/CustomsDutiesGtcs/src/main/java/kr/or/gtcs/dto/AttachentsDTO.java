package kr.or.gtcs.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AttachentsDTO {
	private String fileId;
	private String refId;
	private String refType;
	private String fileType;
	private String fileName;
	private String filePath;
	private String saveName;
	private LocalDate uploadDate;
	private String delYn;
}
