package kr.or.gtcs.util;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

import kr.or.gtcs.dto.AttachentsDTO;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FileUtils {
	
	private final Storage storage;
	
//	@Value("${file.upload-path}")
//	private String uploadPath;

	@Value("${gcs.bucket.name}")
    private String bucketName;
	
	/**
	 * @param refid 신고번호 게시글번호(식별자)
	 * @param refType 참조 유형. IMPORT, EXPORT, BOARD.
	 * @param fileType 파일 종류. INVOICE, BL, PACKING.
	 * @param file 실제파일
	 * @param subDir 저장될 경로
	 * @return 파일저장 dto
	 */
	public AttachentsDTO uploadFile(String refid, String refType, String fileType, MultipartFile file) {
		if (file == null || file.isEmpty()) return null;
		
        String originalName = file.getOriginalFilename();
        String saveName = UUID.randomUUID().toString();
        String gcsFilePath = String.format("%s/%s/%s", refType, fileType, saveName);
        try {
        	BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, gcsFilePath)
        			.setContentType(file.getContentType())
        			.build();
        	storage.createFrom(blobInfo, file.getInputStream());        	
        	String publicUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, gcsFilePath);
            // 5. DB 저장용 정보 세팅
            AttachentsDTO dto = new AttachentsDTO();
            dto.setRefId(refid);
            dto.setRefType(refType);
            dto.setFileType(fileType);
            dto.setFileName(originalName);
            dto.setFilePath(publicUrl);
            dto.setSaveName(saveName);
            return dto;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
	}
}
