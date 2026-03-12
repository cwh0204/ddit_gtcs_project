package kr.or.gtcs.menuurl.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.MenuUrlDTO;

@Mapper
public interface MenuUrlMapper {
	public MenuUrlDTO existsByUrl(String menuUrl);
}
