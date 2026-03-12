package kr.or.gtcs.commons.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorDTO> handleValidationException(MethodArgumentNotValidException e) {
	    String errorMessage = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
	    
	    log.warn("Validation Failed: {}", errorMessage);

	    ErrorDTO response = ErrorDTO.builder()
	            .status(HttpStatus.BAD_REQUEST.value())
	            .message(errorMessage)
	            .build();
	    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(NoHandlerFoundException.class)
	public ResponseEntity<ErrorDTO> handle404(NoHandlerFoundException e) {
	    ErrorDTO response = ErrorDTO.builder()
	            .status(HttpStatus.NOT_FOUND.value())
	            .message("요청하신 페이지를 찾을 수 없습니다: " + e.getRequestURL())
	            .build();
	    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorDTO> handle405(HttpRequestMethodNotSupportedException e) {
	    ErrorDTO response = ErrorDTO.builder()
	            .status(HttpStatus.METHOD_NOT_ALLOWED.value())
	            .message("지원하지 않는 HTTP 메서드입니다.")
	            .build();
	    return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
	}
	
	
	@ExceptionHandler(SystemFailureException.class)
    public ResponseEntity<ErrorDTO> handleSystemFailure(SystemFailureException e) {
        log.error("System Failure: ", e); // 서버 로그에는 상세 정보를 남김
        
        ErrorDTO response = ErrorDTO.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(e.getMessage())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
