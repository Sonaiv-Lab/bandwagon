import { regExpToInterchangeableStr } from './stringRegexp';

import { expect, test } from 'vitest';

const CASES = [
  {
    name: 'parse url',
    regexpStr:
      'https?://(?:www.)?([-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b)*(/[/dw.-]*)*(?:[?])*(.+)*',
  },
];

test.for(CASES)('$name regexp string', ({ regexpStr: regexStr }) => {
  expect(regExpToInterchangeableStr(new RegExp(regexStr))).toEqual(regexStr);
});
