import { ANNOUNCEMENT_STATUS, ANNOUNCEMENT_STATUS_LABELS } from "./announcementConstants";
import { formatDate, formatDateOnly } from "../../utils/formatters";

const summarizeContent = (Content, maxLength = 100) => {
  //목록
  const cleaned = Content.replace(/\r\n|\r|\n/g, " ").trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return cleaned.substring(0, maxLength) + "...";
};

export const toListItem = (dto) => {
  if (!dto) return null;

  const isDeleted = dto.isDeleted === true || dto.deletedDate !== null;

  const status = isDeleted ? ANNOUNCEMENT_STATUS.DELETED : ANNOUNCEMENT_STATUS.ACTIVE;

  return {
    announcementId: dto.announcementId || "-",
    title: dto.title || "제목없음",
    contentSummary: summarizeContent(dto.content, 80),
  };
};
