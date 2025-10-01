export type DecodedFormdata = Record<string, string | number | boolean | null>;

export const toFormdataBody = (payload: DecodedFormdata) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(payload)) {
    params.append(key, value === null ? 'null' : String(value));
  }

  const formdata = params.toString();

  return formdata;
};
