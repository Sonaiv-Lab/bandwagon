import { describe, expect, test } from 'vitest';
import { gameDataSchema } from '../validation';

// scout/.log/getlive/2025_cpbl_A_00358-getlive.json
const CASES = [
  {
    name: 'common',
    desc: '',
    input: {
      PresentStatus: 1,
      IsGameStop: '0',
      GameDateTimeS: '2024-03-30T17:07:00',
      GameDateTimeE: '2024-03-30T20:02:00',
      GameDuringTime: '025500',
      MultyGame: 'N',
      Year: '2024',
      KindCode: 'A',
      GameSeasonCode: '1',
      GameSno: 1,
      GameDate: '2024-03-30T00:00:00',
      GameResult: '0',
      PreExeDate: '2024-03-30T17:05:00',
      VisitingTeamCode: 'AJL011',
      VisitingTeamName: '樂天桃猿',
      HomeTeamCode: 'AAA011',
      HomeTeamName: '味全龍',
      FieldAbbe: '大巨蛋',
      VisitingScore: 2,
      HomeScore: 3,
      MvpAcnt: '0000005543',
      MvpCount: 1,
      VisitingPitcherAcnt: '0000007062',
      HomePitcherAcnt: '0000005543',
      WinningPitcherAcnt: '0000005543',
      LoserPitcherAcnt: '0000007062',
      CloserAcnt: '0000005555',
      VisitingClubSmallImgPath:
        '/files/atts/0L015574823122453305/2024_CPBL六隊Logo_R2_官網.png',
      HomeClubSmallImgPath: '/files/atts/0L021497845061333235/logo_dragon.png',
      WinningPitcherName: '徐若熙',
      LoserPitcherName: '威能帝',
      CloserName: '陳冠偉',
      MvpName: '徐若熙',
      VisitingPitcherName: '威能帝',
      HomePitcherName: '徐若熙',
      IsPlayBall: 'N',
      ReserveDate: null,
    },
  },
];

describe('curtGameDetail normalization', () => {
  test.for(CASES)('$name', ({ name, input }) => {
    expect(() => {
      gameDataSchema.parse(input, { reportInput: true });
    }).not.toThrow();

    expect(
      gameDataSchema.parse(input, { reportInput: true })
    ).toMatchSnapshot();
  });
});
