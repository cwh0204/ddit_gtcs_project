package kr.or.gtcs.attachents.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.AttachentsDTO;

@Mapper
public interface AttachentsMapper {
	public int insertAttachents(AttachentsDTO dto);
	public AttachentsDTO selectAttachents(String fileId);
	public int deleteAttachents(AttachentsDTO dto);
}
