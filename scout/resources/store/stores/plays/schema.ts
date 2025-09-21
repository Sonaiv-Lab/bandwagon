import {
  gameResultValueSchema,
  gameResultSchema,
  fieldOptsSchema,
} from '@bandwagon/shared/constants';
import { z } from 'zod';
import * as Types from '#shared/utils/types';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { GamePlay } from '#shared/model/game';
import {
  fsTimestampSchemaInput,
  fsTimestampSchemaOutput,
} from '#shared/external/firestore';

// 在 firebase 的資料稱作 Document，單純的資料稱作 Store，用命名作出區隔
export type GamePlayStore = GamePlay;
export type GamePlayDoc = Types.ToFirestoreDoc<GamePlayStore>;
export type GamePlayDocJson = Types.ToFirestoreDocJson<GamePlayStore>;

export const playStoreSchema = z
  .object({
    id: z.string(),
    gameId: z.string(),
    isGameStop: z.boolean(),
    // 是不是正在比賽
    isPlayBall: z.boolean(),
    startDatetime: Types.datetimeStringSchema,
    endDatetime: Types.datetimeStringSchema.nullable(),
    durationSeconds: Types.durationSecondsSchema,
    field: fieldOptsSchema,
    result: gameResultSchema,
    homeScore: Types.scoreSchema,
    visitingScore: Types.scoreSchema,
    reserveDate: Types.datetimeStringSchema.nullable(),
    visitingPitcherId: z.string().nullable(),
    visitingPitcherName: z.string().nullable(),
    homePitcherId: z.string().nullable(),
    homePitcherName: z.string().nullable(),
    winningPitcherId: z.string().nullable(),
    winningPitcherName: z.string().nullable(),
    loserPitcherId: z.string().nullable(),
    loserPitcherName: z.string().nullable(),
    closerId: z.string().nullable(),
    closerName: z.string().nullable(),
    mvpPlayerId: z.string().nullable(),
    mvpPlayerName: z.string().nullable(),
    mvpCount: z.int().nullable(),
  })
  .required({
    id: true,
    gameId: true,
  }) satisfies SchemaFromInterface<GamePlayStore>;

export const playDocSchemaDomain = z.object({
  ...playStoreSchema.shape,
  createdAt: fsTimestampSchemaInput,
  updatedAt: fsTimestampSchemaInput,
});

export const playDocSchemaRaw = z.object({
  id: playDocSchemaDomain.shape['id'],
  game_id: playDocSchemaDomain.shape['gameId'],
  is_game_stop: playDocSchemaDomain.shape['isGameStop'],
  is_play_ball: playDocSchemaDomain.shape['isPlayBall'],
  start_datetime: playDocSchemaDomain.shape['startDatetime'],
  end_datetime: playDocSchemaDomain.shape['endDatetime'],
  duration_seconds: playDocSchemaDomain.shape['durationSeconds'],
  field: playDocSchemaDomain.shape['field'],
  result: playDocSchemaDomain.shape['result'],
  home_score: playDocSchemaDomain.shape['homeScore'],
  visiting_score: playDocSchemaDomain.shape['visitingScore'],
  reserve_date: playDocSchemaDomain.shape['reserveDate'],
  visiting_pitcher_id: playDocSchemaDomain.shape['visitingPitcherId'],
  visiting_pitcher_name: playDocSchemaDomain.shape['visitingPitcherName'],
  home_pitcher_id: playDocSchemaDomain.shape['homePitcherId'],
  home_pitcher_name: playDocSchemaDomain.shape['homePitcherName'],
  winning_pitcher_id: playDocSchemaDomain.shape['winningPitcherId'],
  winning_pitcher_name: playDocSchemaDomain.shape['winningPitcherName'],
  loser_pitcher_id: playDocSchemaDomain.shape['loserPitcherId'],
  loser_pitcher_name: playDocSchemaDomain.shape['loserPitcherName'],
  closer_id: playDocSchemaDomain.shape['closerId'],
  closer_name: playDocSchemaDomain.shape['closerName'],
  mvp_player_id: playDocSchemaDomain.shape['mvpPlayerId'],
  mvp_player_name: playDocSchemaDomain.shape['mvpPlayerName'],
  mvp_count: playDocSchemaDomain.shape['mvpCount'],
  created_at: fsTimestampSchemaOutput,
  updated_at: fsTimestampSchemaOutput,
});

export const toRaw = (playDocDomain: z.infer<typeof playDocSchemaDomain>) => {
  return {
    id: playDocDomain['id'],
    game_id: playDocDomain['gameId'],
    is_game_stop: playDocDomain['isGameStop'],
    is_play_ball: playDocDomain['isPlayBall'],
    start_datetime: playDocDomain['startDatetime'],
    end_datetime: playDocDomain['endDatetime'],
    duration_seconds: playDocDomain['durationSeconds'],
    field: playDocDomain['field'],
    result: playDocDomain['result'],
    home_score: playDocDomain['homeScore'],
    visiting_score: playDocDomain['visitingScore'],
    reserve_date: playDocDomain['reserveDate'],
    visiting_pitcher_id: playDocDomain['visitingPitcherId'],
    visiting_pitcher_name: playDocDomain['visitingPitcherName'],
    home_pitcher_id: playDocDomain['homePitcherId'],
    home_pitcher_name: playDocDomain['homePitcherName'],
    winning_pitcher_id: playDocDomain['winningPitcherId'],
    winning_pitcher_name: playDocDomain['winningPitcherName'],
    loser_pitcher_id: playDocDomain['loserPitcherId'],
    loser_pitcher_name: playDocDomain['loserPitcherName'],
    closer_id: playDocDomain['closerId'],
    closer_name: playDocDomain['closerName'],
    mvp_player_id: playDocDomain['mvpPlayerId'],
    mvp_player_name: playDocDomain['mvpPlayerName'],
    mvp_count: playDocDomain['mvpCount'],
    created_at: playDocDomain['createdAt'],
    updated_at: playDocDomain['updatedAt'],
  };
};

export const toDomain = (playDocRaw: z.infer<typeof playDocSchemaRaw>) => {
  return {
    id: playDocRaw['id'],
    gameId: playDocRaw['game_id'],
    isGameStop: playDocRaw['is_game_stop'],
    isPlayBall: playDocRaw['is_play_ball'],
    startDatetime: playDocRaw['start_datetime'],
    endDatetime: playDocRaw['end_datetime'],
    durationSeconds: playDocRaw['duration_seconds'],
    field: playDocRaw['field'],
    result: playDocRaw['result'],
    homeScore: playDocRaw['home_score'],
    visitingScore: playDocRaw['visiting_score'],
    reserveDate: playDocRaw['reserve_date'],
    visitingPitcherId: playDocRaw['visiting_pitcher_id'],
    visitingPitcherName: playDocRaw['visiting_pitcher_name'],
    homePitcherId: playDocRaw['home_pitcher_id'],
    homePitcherName: playDocRaw['home_pitcher_name'],
    winningPitcherId: playDocRaw['winning_pitcher_id'],
    winningPitcherName: playDocRaw['winning_pitcher_name'],
    loserPitcherId: playDocRaw['loser_pitcher_id'],
    loserPitcherName: playDocRaw['loser_pitcher_name'],
    closerId: playDocRaw['closer_id'],
    closerName: playDocRaw['closer_name'],
    mvpPlayerId: playDocRaw['mvp_player_id'],
    mvpPlayerName: playDocRaw['mvp_player_name'],
    mvpCount: playDocRaw['mvp_count'],
    createdAt: playDocRaw['created_at'],
    updatedAt: playDocRaw['updated_at'],
  };
};
