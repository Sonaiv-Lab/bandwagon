import rest from '#/network/rest';
import { useQuery } from '@tanstack/react-query';
import type { Game } from "@bandwagon/shared/modules/game";

type Props = {
  id: string;
};

const getGame = ({ id }: Props) => {
  const response = rest<Game>('/games/' + id);
  console.log(response);

  return response
};

const useGame = ({ id }: Props) => {
  return useQuery({
    queryFn: () => getGame({ id }),
    queryKey: ['games', id],
    select: ({ body }) => body
  });
};

export { useGame };
