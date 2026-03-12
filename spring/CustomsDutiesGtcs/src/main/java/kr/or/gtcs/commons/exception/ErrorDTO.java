package kr.or.gtcs.commons.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ErrorDTO {
	private final int status;
	private final String message;
	
	@Builder.Default
	private final LocalDateTime timestamp = LocalDateTime.now();
}
