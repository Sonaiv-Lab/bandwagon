import { describe, expect, test } from 'vitest';
import { scoreboardSchema } from './validation';

// scout/.log/getlive/2025_cpbl_A_00358-getlive.json
const CASES = [
  {
    name: 'latest inning',
    desc: '',
    input: {
      TeamName: '台鋼雄鷹',
      TeamAbbr: '台鋼雄鷹',
      TeamNo: 'AKP011',
      VisitingHomeType: '2',
      InningSeq: 9.0,
      ScoreCnt: 0.0,
      HittingCnt: 0.0,
      ErrorCnt: 0.0,
      IsAdmit: '1',
      MainEventNoS: '',
      SubEventNoS: '',
      MainEventNoE: '',
      SubEventNoE: '',
      Seq: '0000000001',
      Year: '2025',
      KindCode: 'A',
      GameSeasonCode: '2',
      GameSno: 358.0,
      Pkno: 'Z04EGEFE',
      CreateTime: '2025-09-28T18:19:20',
      CreateUser: 'bo138',
      UpdateTime: '2025-09-28T18:20:31',
      UpdateUser: 'bo138',
      Rowstamp: '',
    },
  },
  {
    name: 'common inning',
    desc: '',
    input: {
      TeamName: '統一棒球隊股份有限公司',
      TeamAbbr: '統一7-ELEVEn獅',
      TeamNo: 'ADD011',
      VisitingHomeType: '1',
      InningSeq: 9.0,
      ScoreCnt: 0.0,
      HittingCnt: 1.0,
      ErrorCnt: 0.0,
      IsAdmit: '1',
      MainEventNoS: '0910001000',
      SubEventNoS: '0000000001',
      MainEventNoE: '0910018000',
      SubEventNoE: '0000000001',
      Seq: '0000000001',
      Year: '2025',
      KindCode: 'A',
      GameSeasonCode: '2',
      GameSno: 358.0,
      Pkno: 'Z04EFWDB',
      CreateTime: '2025-09-28T18:09:15',
      CreateUser: 'bo138',
      UpdateTime: '2025-09-28T18:20:31',
      UpdateUser: 'bo138',
      Rowstamp: '',
    },
  },
];


describe('scoreboard normalization', () => {
  test.for(CASES)('$name', ({ name, input }) => {
    expect(() =>
      scoreboardSchema.parse(input, { reportInput: true })
    ).not.toThrow();

    expect(
      scoreboardSchema.parse(input, { reportInput: true })
    ).toMatchSnapshot();
  });
});
