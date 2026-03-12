package kr.or.gtcs.menuurl.service;

import kr.or.gtcs.dto.MenuUrlDTO;

public interface MenuUrlService {
	public MenuUrlDTO existsByUrl(String menuUrl);
}
