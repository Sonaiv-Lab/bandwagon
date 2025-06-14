import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ComponentProps} from 'react';

const queryClient = new QueryClient();

const QueryProvider = (
  props: Omit<ComponentProps<typeof QueryClientProvider>, 'client'>,
) => {
  return <QueryClientProvider client={queryClient} {...props} />;
};

export {QueryProvider};
