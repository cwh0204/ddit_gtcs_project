package kr.or.gtcs.attachents.service;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Storage;

import kr.or.gtcs.attachents.mapper.AttachentsMapper;
import kr.or.gtcs.dto.AttachentsDTO;
import kr.or.gtcs.util.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class AttachentsServiceImpl implements AttachentsService{
	
	private final AttachentsMapper mapper;
	private final FileUtils fileUtil;

    private final Storage storage; 

    @Value("${gcs.bucket.name}")
    private String bucketName;
	
	@Override
	public Map<String, Object> getFile(String fileId) {
		
		AttachentsDTO dto = mapper.selectAttachents(fileId);
	    if (dto == null) throw new RuntimeException("파일 정보 없음");

	    // 2. GCS 내 파일 경로 구성 (업로드할 때 만든 규칙과 동일해야 함)
	    // 예: "board/file0/uuid_파일명"
	    String gcsFilePath = dto.getRefType() + "/" + dto.getFileType() + "/" + dto.getSaveName();

	    Blob blob = storage.get(bucketName, gcsFilePath);
	    if (blob == null || !blob.exists()) {
	        throw new RuntimeException("구글 클라우드 저장소에 실제 파일이 없습니다.");
	    }

	    byte[] content = blob.getContent();
	    Resource resource = new ByteArrayResource(content);

	    Map<String, Object> resultMap = new HashMap<>();
	    resultMap.put("resource", resource);
	    resultMap.put("dto", dto);
	    
	    return resultMap;
	}

	@Override
	public void uploadMultipleFiles(String refId, String refType, Map<String, MultipartFile> fileMap) {
		fileMap.forEach((fileType, file) -> {
			
            if (file != null && !file.isEmpty()) {
                
                AttachentsDTO deleteInfo = new AttachentsDTO();
                deleteInfo.setRefId(refId);
                deleteInfo.setFileType(fileType);
                mapper.deleteAttachents(deleteInfo);

                AttachentsDTO newInfo = fileUtil.uploadFile(refId, refType, fileType, file);
                if (newInfo != null) {
                	mapper.insertAttachents(newInfo);
                }
            }
        });
	}

	@Override
	public void deleteFile(String fileId) {
		AttachentsDTO fileInfo = mapper.selectAttachents(fileId);
	    
	    if (fileInfo != null) {
	        String gcsFilePath = fileInfo.getRefType() + "/" + fileInfo.getFileType() + "/" + fileInfo.getSaveName();
	        BlobId blobId = BlobId.of(bucketName, gcsFilePath);
	        boolean deleted = storage.delete(blobId);
	        if (deleted) {
	            log.info("GCS 파일 삭제 성공: " + gcsFilePath);
	        } else {
	        	log.info("GCS 파일 삭제 실패 (파일이 없거나 권한 문제): " + gcsFilePath);
	        }
	    }
	    AttachentsDTO deleteInfo = new AttachentsDTO();
	    deleteInfo.setFileId(fileId);
	    mapper.deleteAttachents(deleteInfo);
	}
}
