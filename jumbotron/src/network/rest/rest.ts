import {REST_BASE_URL} from '#/constants/env';
import {JSONlike} from '#/utils/types';

// now, only string is available, maybe add URL, Request objecdt in future but not now
type Endpoint = string;
type Config = Parameters<typeof fetch>[1];

const rest = async <T extends JSONlike = JSONlike>(
  endpoint: Endpoint,
  config?: Config,
) => {
  const url = REST_BASE_URL + endpoint;

  const response = await fetch(url, config);

  const body: T = await response.json();

  return {
    ...response,
    body,
  };
};

export {rest};
