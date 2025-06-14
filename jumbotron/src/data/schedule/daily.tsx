import rest from '#/network/rest';
import { useQuery } from '@tanstack/react-query';
import {type DailySchedule} from '@bandwagon/shared/modules/schedule';

type Props = { year: string };

const getSchedule = ({ year }: Props) => {
  const response = rest<DailySchedule>('/schedule/daily/' + year)

  return response;
};

const useDailySchedule = ({ year }: Props) => {
  return useQuery({
    queryFn: () => getSchedule({ year }),
    queryKey: ['schedule', 'daily', year],
    select: ({ body }) => body
  });
};

export { useDailySchedule };
