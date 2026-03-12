package kr.or.gtcs.menuurl.service;

import org.springframework.stereotype.Service;

import kr.or.gtcs.dto.MenuUrlDTO;
import kr.or.gtcs.menuurl.mapper.MenuUrlMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuUrlServiceImpl implements MenuUrlService {

	private final MenuUrlMapper mapper;
	
	@Override
	public MenuUrlDTO existsByUrl(String menuUrl) {
		return mapper.existsByUrl(menuUrl);
	}
}
