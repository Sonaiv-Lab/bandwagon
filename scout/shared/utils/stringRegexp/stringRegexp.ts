export const regExpToInterchangeableStr = (input: RegExp) => {
  return input
    .toString()
    .replace(/^\//, '') // start slash slash
    .replace(/\/$/, '') // end slash
    .replace(/\\\//g, `\/`); // slash escape
};
