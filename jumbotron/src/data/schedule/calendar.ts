import rest from '#/network/rest';
import {useQuery} from '@tanstack/react-query';
import {type Calendar} from '@bandwagon/shared/modules/schedule';

const getCalendar = () => {
  const response = rest<Calendar>('/schedule/calendar');

  return response;
};

const useCalendar = () => {
  return useQuery({
    queryFn: () => getCalendar(),
    queryKey: ['schedule', 'calendar'],
    select: ({body}) => body,
  });
};

export {useCalendar};
