import { describe, expect, test } from 'vitest';
import { gameIdRule, gameIdUnitsSchema } from './gameId';
import { gamePlayIdRule, gamePlayIdUnitsSchema } from './gamePlayId';
import { inningIdRule, inningIdUnitsSchema } from './inningId';
import { pitchIdRule, pitchIdUnitsSchema } from './pitchId';
import { ZodType } from 'zod';

const createTestCase =
  ({ rule, schema }: { rule: RegExp; schema: ZodType }) =>
  ({ id, result }: { id: string; result: boolean }) => {
    const run = () => {
      schema.parse(rule.exec(id)?.groups, { reportInput: true });
    };

    if (result) {
      expect(run).not.toThrowError();
    } else {
      expect(run).toThrowError();
    }
  };

describe('gameId', () => {
  const CASES = [
    { name: 'valid', id: '2025-cpbl-A-00001', result: true },
    { name: 'inCorrect', id: '1995-mlb-A+-00354', result: false },
  ];

  test.for(CASES)(
    '$name: $id',
    createTestCase({ rule: gameIdRule, schema: gameIdUnitsSchema })
  );
});

describe('gamePlayId', () => {
  const CASES = [
    { name: 'valid', id: '2024-cpbl-A-00266__0512', result: true },
    { name: 'inCorrect', id: '2025-cpbl-A-00266__05212', result: false },
  ];

  test.for(CASES)(
    '$name: $id',
    createTestCase({ rule: gamePlayIdRule, schema: gamePlayIdUnitsSchema })
  );
});

describe('inningId', () => {
  const CASES = [
    { name: 'valid', id: '2024-cpbl-A-00266__0512__09-0', result: true },
    { name: 'inCorrect', id: '2024-cpbl-A-00266__0512__09t', result: false },
  ];

  test.for(CASES)(
    '$name: $id',
    createTestCase({ rule: inningIdRule, schema: inningIdUnitsSchema })
  );
});

describe('pitchId', () => {
  const CASES = [
    { name: 'valid', id: '2024-cpbl-A-00266__0512__09-0__00555', result: true },
    {
      name: 'inCorrect',
      id: '2024-cpbl-A-00266__0512__09-1__050122',
      result: false,
    },
    {
      name: 'inCorrect',
      desc: 'not end with correct pattern',
      id: '2024-cpbl-A-00266__0512__09-1__050122_214124',
      result: false,
    },
  ];

  test.for(CASES)(
    '$name gameId: $id',
    createTestCase({ rule: pitchIdRule, schema: pitchIdUnitsSchema })
  );
});
