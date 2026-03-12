package kr.or.gtcs.attachents.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface AttachentsService {
	
	public Map<String, Object> getFile(String fileId);
	
	public void uploadMultipleFiles(String refId, String refType, Map<String, MultipartFile> fileMap);
	
	public void deleteFile(String fileId);
}
