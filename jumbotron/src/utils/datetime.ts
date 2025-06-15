import { DateTime } from "luxon";


/**
  to format 2025/06/28（六）
*/
export const toFullShort = (datetime: DateTime<true> | DateTime<false>) => {
  const WEEKDAY_MAP = ['日','一','二','三','四','五','六'];
  const formatted = `${datetime.toFormat('yyyy/MM/dd')}（${WEEKDAY_MAP[datetime.weekday % 7]}）`;

  return formatted
}