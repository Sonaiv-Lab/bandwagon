import {DateTime} from 'luxon';

const WEEKDAY_MAP = ['日', '一', '二', '三', '四', '五', '六'];
const FULL_WEEKDAY_MAP = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
/**
  to format 2025/06/28（六）
*/
export const toYYYY_MM_DD_C = (datetime: DateTime<true> | DateTime<false>) => {
  const formatted = `${datetime.toFormat('yyyy/MM/dd')} (${
    WEEKDAY_MAP[datetime.weekday % 7]
  })`;

  return formatted;
};

/**
  to format 2025/06/28 星期六
*/
export const toYYYY_MM_DD_CCCC = (
  datetime: DateTime<true> | DateTime<false>,
) => {
  if (!datetime.isValid) return '';

  const formatted = `${datetime.toFormat('yyyy/MM/dd')} ${
    FULL_WEEKDAY_MAP[datetime.weekday % 7]
  }`;

  return formatted
};
