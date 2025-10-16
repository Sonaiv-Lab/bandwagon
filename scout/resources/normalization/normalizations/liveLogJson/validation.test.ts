import { describe, expect, test } from 'vitest';
import { liveLogSchema } from './validation';

// scout/.log/getlive/2025_cpbl_A_00358-getlive.json
const CASES = [
  {
    name: 'common',
    desc: '',
    input: {
      DefendStationCode: 'LF',
      HitterImgPath: '/files/atts/0L088853811359500564/14邱智呈2025.jpg',
      Year: '2025',
      KindCode: 'A',
      GameSno: 358,
      InningSeq: 1,
      VisitingHomeType: '1',
      BattingOrder: 1,
      Content: '好球沒揮棒。',
      MainEventNo: '0110001000',
      HitterAcnt: '0000005531',
      HitterUniformNo: '14',
      HitterName: '邱智呈',
      HitterDefendStation: '7',
      HitterLineup: 1,
      PitcherAcnt: '0000002679',
      PitcherUniformNo: '20',
      PitcherName: '江承諺',
      CatcherAcnt: '0000006211',
      CatcherUniformNo: '29',
      CatcherName: '張肇元',
      IsStrike: '1',
      IsBall: '0',
      IsChangePlayer: '0',
      FirstBase: '',
      SecondBase: '',
      ThirdBase: '',
      StrikeCnt: 1,
      BallCnt: 0,
      PitchCnt: 1,
      OutCnt: 0,
      ActionName: '一壘安打 ',
      BattingActionName: '一安',
      IsScoreCnt: '0',
      VisitingScore: 0,
      HomeScore: 0,
      Pkno: 'Z04EGY24',
      CreateTime: '2025-09-28T18:34:42',
      CreateUser: 'system',
      UpdateTime: '2025-09-28T18:34:42',
      UpdateUser: 'system',
      Rowstamp: '183442561',
      IsSpecialEvent: '0',
    },
  },
];


describe('liveLog normalization', () => {
  test.for(CASES)('$name', ({ name, input }) => {
    expect(() =>
      liveLogSchema.parse(input, { reportInput: true })
    ).not.toThrow();
  });
});