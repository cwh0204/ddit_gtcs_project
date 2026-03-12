package kr.or.gtcs.dto;

import lombok.Data;

@Data
public class CriteriaDTO {
	
    private int pageNum = 1;   // 기본값 1페이지
    private int amount = 10;   // 기본값 10개

    private String type;
    private String keyword;
    private String startDate;
    private String endDate;

    public int getStartRow() {
        return (this.pageNum - 1) * this.amount + 1;
    }

    public int getEndRow() {
        return this.pageNum * this.amount;
}
}

