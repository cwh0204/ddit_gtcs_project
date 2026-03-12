package kr.or.gtcs.attachents.controller;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;
import org.apache.ibatis.annotations.Delete;
import org.springframework.core.io.Resource;
import kr.or.gtcs.attachents.service.AttachentsService;
import kr.or.gtcs.dto.AttachentsDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AttachentsController {
	
	private final AttachentsService service;
	
	@GetMapping("/download/{fileId}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {

	    Map<String, Object> fileData = service.getFile(fileId);
	    
	    Resource resource = (Resource) fileData.get("resource");
	    AttachentsDTO dto = (AttachentsDTO) fileData.get("dto");

	    if (resource == null || !resource.exists()) {
	        return ResponseEntity.notFound().build();
	    }

	    String encodedName = UriUtils.encode(dto.getFileName(), StandardCharsets.UTF_8);

	    return ResponseEntity.ok()
	            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedName + "\"")
	            .contentType(MediaType.APPLICATION_OCTET_STREAM)
	            .body(resource);
	}
	
	@DeleteMapping("/delete/{fileId}")
	public void delteFile(@PathVariable String fileId) {
		service.deleteFile(fileId);
	}
}
