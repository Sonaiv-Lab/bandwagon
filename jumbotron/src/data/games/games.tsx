import rest from '#/network/rest';
import {useQuery} from '@tanstack/react-query';

type Props = {
  id: string;
};

const getGames = ({id}: Props) => {
  const response = rest('/games/' + id);
  console.log(response);
  
  return response
};

export {getGames};

const useGames = ({id}: Props) => {
  return useQuery({
    queryFn: () => getGames({id}),
    queryKey: ['games', id],
  });
};

export {useGames};
