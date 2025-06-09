import { intercept } from '#/utils/interceptNetworkFromPage';
import { z, ZodError } from 'zod';
import { Scheme as KindCodeScheme } from '#/variables/kindCode';
import { FieldOptsScheme } from '#/variables/fieldOpts';
import { DateTime, IANAZone } from 'luxon';
import { request } from 'undici';
import { GamesDatasSchema } from './schema';

import type { TGamesDatasSchema, TGamesData } from './schema';
import { Game, GameScheme } from '#/resources/game/types';

/**
one endpoint need 
- a URL: its important, it need to be base by page. 
- multiple endpoints
- schema by endpoints
- 

there are 2 kind of way to get Data
1. intercept from browser response
  1.1 first render
  1.2 control the page to get new request response
2. intercept the header, than call from server

1.1 is more straight forward, but restrictive. 

The key point is, which way is for consistent. Calling from server would be more consistent and more simple to me. Stick on this way first, But there must need the way to imitate user action in future.
*/

/**
the data sturecture would be like this
{
  url: ...
  endpoints: {
    [link]: 
      responseSchema (include validator)
      dataSelector: () => {}
      dataSchema (include validator)
  }
}
*/

const ResponseSchema = z.object({
  Success: z.boolean(),
  GameDatas: z.string(),
});

type TResponseSchema = z.infer<typeof ResponseSchema>;

const ORIGIN = 'https://www.cpbl.com.tw';
const URL = 'https://www.cpbl.com.tw/schedule';
const ENDPOINT = 'https://www.cpbl.com.tw/schedule/getgamedatas';

const Body = z
  .object({
    calendar: z.string().regex(/\d\d\d\d\/\d\d\/\d\d/), // YYYY/MM/DD
    location: FieldOptsScheme,
    kindCode: KindCodeScheme,
  })
  .required();

type Body = z.infer<typeof Body>;

const createBody = (body: Body) => {
  return new URLSearchParams(body).toString();
};

const fetchRawGames = async () => {
  try {
    const interceptedData = await intercept(URL, [ENDPOINT]);

    const req = interceptedData[ENDPOINT]?.[0];

    if (!req) {
      throw new Error('request not found');
    }

    const headers = req.headers();
    const url = req.url();

    const body = {
      calendar: '2025/01/01',
      location: '',
      kindCode: 'A',
    } satisfies Body;

    const res = await request(url, {
      method: 'POST',
      body: createBody(body),
      headers,
    });

    const json = (await res.body.json()) as TResponseSchema;

    ResponseSchema.parse(json);

    const gameDataJson = json.GameDatas;

    const gameData = JSON.parse(gameDataJson) as TGamesDatasSchema;

    await GamesDatasSchema.parseAsync(gameData);

    return gameData;
  } catch (err) {
    throw err;
  }
};

const toISODatetimeWithZone = (
  isoString: string,
  tz: string
): string | null => {
  const timezone = IANAZone.isValidZone(tz) ? tz : DateTime.local().zoneName;

  const datetime = DateTime.fromISO(isoString);

  return datetime.isValid ? datetime.setZone(timezone).toISO() ?? null : null;
};

const transformDuringTime = (hhmmss: string) => {
  const match = hhmmss.match(/(?<h>\d{2})(?<m>\d{2})(?<s>\d{2})/);

  if (!match) return 0;
  if (!match.groups?.h || !match.groups?.m || !match.groups?.s) return 0;

  const numerate = z.coerce.number();

  const hours = numerate.parse(match.groups.h);
  const minutes = numerate.parse(match.groups.m);
  const seconds = numerate.parse(match.groups.s);

  return hours * 60 * 60 + minutes * 60 + seconds;
};

const createCPBLId = (data: TGamesData) => {
  const year = data.Year;
  const seriesInfo = 'cpbl';
  const kind = data.KindCode;
  const id = String(data.GameSno).padStart(5, '0');

  return `${year}-${seriesInfo}-${kind}-${id}`;
};

const transformCPBLIconUrl = (
  path:
    | TGamesData['HomeClubSmallImgPath']
    | TGamesData['VisitingClubSmallImgPath']
) => ORIGIN + path;

const GameResultMap: Record<TGamesData['GameResult'], Game['result']> = {
  '': 'pending',
  '0': 'ended',
  '1': 'postponed',
  '2': 'suspended',
};

const toGameData = (data: TGamesData): Game => {
  const game: Game = {
    id: createCPBLId(data),
    gameNo: data.GameSno,
    year: data.Year,
    gameKindCode: data.KindCode,
    gameSeason: data.GameSeasonCode,
    gameSeriesNo: data.GameSno,
    isGameStop: data.IsGameStop === '1' ? true : false,
    startDatetime:
      toISODatetimeWithZone(data.GameDateTimeS, 'Asia/Taipei') ?? '',
    endDatetime: toISODatetimeWithZone(data.GameDateTimeE ?? '', 'Asia/Taipei'),
    result: GameResultMap[data.GameResult],
    durationSeconds: transformDuringTime(data.GameDuringTime),
    reserveDate: toISODatetimeWithZone(data.ReserveDate ?? '', 'Asia/Taipei'),
    // score
    homeScore: data.HomeScore,
    visitingScore: data.VisitingScore,
    // team info
    homeTeamCode: data.HomeTeamCode,
    homeTeamName: data.HomeTeamName,
    homeTeamIconUrl: transformCPBLIconUrl(data.HomeClubSmallImgPath),
    visitingTeamCode: data.VisitingTeamCode,
    visitingTeamName: data.VisitingTeamName,
    visitingTeamIconUrl: transformCPBLIconUrl(data.VisitingClubSmallImgPath),
    // player info
    mvpPlayerId: data.MvpAcnt,
    mvpPlayerName: data.MvpName,
    mvpCount: data.MvpCount,
    visitingPitcherId: data.VisitingPitcherAcnt,
    visitingPitcherName: data.VisitingPitcherName,
    homePitcherId: data.HomePitcherAcnt,
    homePitcherName: data.HomePitcherName,
    winningPitcherId: data.WinningPitcherAcnt,
    winningPitcherName: data.WinningPitcherName,
    loserPitcherId: data.LoserPitcherAcnt,
    loserPitcherName: data.LoserPitcherName,
    closerId: data.CloserAcnt,
    closerName: data.CloserName,
  };

  return game;
};

const getGamesData = async () => {
  const rawGames = (await fetchRawGames()) ?? [];

  const games = rawGames.map((game) => toGameData(game));

  z.array(GameScheme).parse(games);

  return games;
};

export { getGamesData };
