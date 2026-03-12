package kr.or.gtcs.aidoccheck.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.gtcs.dto.AiDocCheckDTO;

@Mapper
public interface AiDocCheckMapper {
	
	public int insertAiDocCheck(AiDocCheckDTO aidoc);
	public int updateAiDocComment(@Param("checkId") String checkId, @Param("docComment") String docComment);
	public int updateAiDocCheck(AiDocCheckDTO aidoc);
}
