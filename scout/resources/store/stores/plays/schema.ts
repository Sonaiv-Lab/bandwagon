import { z } from 'zod';
import * as Types from '#shared/utils/types';
import type { SchemaFromInterface } from '@bandwagon/shared/utils/zod';
import type { GamePlay } from '#shared/model/game';
import {
  fsTimestampSchemaInput,
  fsTimestampSchemaOutput,
} from '#shared/external/firestore';
import { gamePlaySchema } from '#resources/schema/schemas/game';

// 在 firebase 的資料稱作 Document，單純的資料稱作 Store，用命名作出區隔
export type GamePlayStore = GamePlay;
export type GamePlayDocInput = Types.ToFirestoreDocInput<GamePlay>;
export type GamePlayDocOutput = Types.ToFirestoreDocOutput<GamePlay>;

export const playStoreSchema = z.object({
  ...gamePlaySchema.shape,
}) satisfies SchemaFromInterface<GamePlayStore>;

const inningSchema = playStoreSchema.shape.halfInnings.unwrap();

export const playDocInputSchema = z.object({
  id: playStoreSchema.shape['id'],
  game_id: playStoreSchema.shape['gameId'],
  field: playStoreSchema.shape['field'],
  start_datetime: playStoreSchema.shape['startDatetime'],
  end_datetime: playStoreSchema.shape['endDatetime'],

  // 比賽狀態
  home_score: playStoreSchema.shape['homeScore'],
  visiting_score: playStoreSchema.shape['visitingScore'],
  result: playStoreSchema.shape['result'],
  reserve_date: playStoreSchema.shape['reserveDate'],
  duration_seconds: playStoreSchema.shape['durationSeconds'],
  is_game_stop: playStoreSchema.shape['isGameStop'],
  is_play_ball: playStoreSchema.shape['isPlayBall'],
  audience_count: playStoreSchema.shape['audienceCount'],

  // 球員資訊
  closer_id: playStoreSchema.shape['closerId'],
  closer_name: playStoreSchema.shape['closerName'],
  home_pitcher_id: playStoreSchema.shape['homePitcherId'],
  home_pitcher_name: playStoreSchema.shape['homePitcherName'],
  loser_pitcher_id: playStoreSchema.shape['loserPitcherId'],
  loser_pitcher_name: playStoreSchema.shape['loserPitcherName'],
  visiting_pitcher_id: playStoreSchema.shape['visitingPitcherId'],
  visiting_pitcher_name: playStoreSchema.shape['visitingPitcherName'],
  winning_pitcher_id: playStoreSchema.shape['winningPitcherId'],
  winning_pitcher_name: playStoreSchema.shape['winningPitcherName'],
  winning_rbi_hitter_id: playStoreSchema.shape['winningRbiHitterId'],

  // MVP 資訊
  mvp_count: playStoreSchema.shape['mvpCount'],
  mvp_player_id: playStoreSchema.shape['mvpPlayerId'],
  mvp_player_name: playStoreSchema.shape['mvpPlayerName'],
  mvp_ab_count: playStoreSchema.shape['mvpAbCount'],
  mvp_rbi_count: playStoreSchema.shape['mvpRbiCount'],
  mvp_run_count: playStoreSchema.shape['mvpRunCount'],
  mvp_hit_count: playStoreSchema.shape['mvpHitCount'],
  mvp_home_run_count: playStoreSchema.shape['mvpHomeRunCount'],
  mvp_k_count: playStoreSchema.shape['mvpKCount'],
  mvp_ra_count: playStoreSchema.shape['mvpRaCount'],
  mvp_outs_pitched_count: playStoreSchema.shape['mvpOutsPitchedCount'],
  mvp_is_visiting_team: playStoreSchema.shape['mvpIsVisitingTeam'],

  // 裁判
  umpire_hp: playStoreSchema.shape['umpireHp'],
  umpire_1b: playStoreSchema.shape['umpire1b'],
  umpire_2b: playStoreSchema.shape['umpire2b'],
  umpire_3b: playStoreSchema.shape['umpire3b'],
  umpire_lf: playStoreSchema.shape['umpireLf'],
  umpire_rf: playStoreSchema.shape['umpireRf'],

  half_innings: z.record(
    z.string(),
    z.object({
      id: inningSchema.shape.id,
      inning_no: inningSchema.shape.inningNo,
      half_inning: inningSchema.shape.halfInning,
      offense_team_code: inningSchema.shape.offenseTeamCode,
      defense_team_code: inningSchema.shape.defenseTeamCode,
      score_count: inningSchema.shape.scoreCount,
      hit_count: inningSchema.shape.hitCount,
      error_count: inningSchema.shape.errorCount,
      start_pitch_id: inningSchema.shape.startPitchId,
      end_pitch_id: inningSchema.shape.endPitchId,
      source: inningSchema.shape.source,
    })
  ),

  // meta info
  created_at: fsTimestampSchemaInput,
  updated_at: fsTimestampSchemaInput,

  source: playStoreSchema.shape.source,
}) satisfies SchemaFromInterface<GamePlayDocInput>;

export const playDocOutputSchema = z.object({
  id: playDocInputSchema.shape['id'],
  game_id: playDocInputSchema.shape['game_id'],
  field: playDocInputSchema.shape['field'],
  start_datetime: playDocInputSchema.shape['start_datetime'],
  end_datetime: playDocInputSchema.shape['end_datetime'].default(null),

  // 比賽狀態
  is_game_stop: playDocInputSchema.shape['is_game_stop'].default(false),
  is_play_ball: playDocInputSchema.shape['is_play_ball'].default(false),
  result: playDocInputSchema.shape['result'].default('pending'),
  duration_seconds: playDocInputSchema.shape['duration_seconds'].default(0),
  home_score: playDocInputSchema.shape['home_score'].default(null),
  visiting_score: playDocInputSchema.shape['visiting_score'].default(null),
  reserve_date: playDocInputSchema.shape['reserve_date'].default(null),
  audience_count: playDocInputSchema.shape['audience_count'].default(null),

  // 球員資訊
  closer_id: playDocInputSchema.shape['closer_id'].default(null),
  closer_name: playDocInputSchema.shape['closer_name'].default(null),
  home_pitcher_id: playDocInputSchema.shape['home_pitcher_id'].default(null),
  home_pitcher_name:
    playDocInputSchema.shape['home_pitcher_name'].default(null),
  loser_pitcher_id: playDocInputSchema.shape['loser_pitcher_id'].default(null),
  loser_pitcher_name:
    playDocInputSchema.shape['loser_pitcher_name'].default(null),
  visiting_pitcher_id:
    playDocInputSchema.shape['visiting_pitcher_id'].default(null),
  visiting_pitcher_name:
    playDocInputSchema.shape['visiting_pitcher_name'].default(null),
  winning_pitcher_id:
    playDocInputSchema.shape['winning_pitcher_id'].default(null),
  winning_pitcher_name:
    playDocInputSchema.shape['winning_pitcher_name'].default(null),
  winning_rbi_hitter_id: playDocInputSchema.shape['winning_rbi_hitter_id']
    .default(null)
    .catch(null),

  // MVP 資訊
  mvp_count: playDocInputSchema.shape['mvp_count'].default(null),
  mvp_player_id: playDocInputSchema.shape['mvp_player_id'].default(null),
  mvp_player_name: playDocInputSchema.shape['mvp_player_name'].default(null),
  mvp_ab_count: playDocInputSchema.shape['mvp_ab_count'].default(null),
  mvp_rbi_count: playDocInputSchema.shape['mvp_rbi_count'].default(null),
  mvp_run_count: playDocInputSchema.shape['mvp_run_count'].default(null),
  mvp_hit_count: playDocInputSchema.shape['mvp_hit_count'].default(null),
  mvp_home_run_count:
    playDocInputSchema.shape['mvp_home_run_count'].default(null),
  mvp_k_count: playDocInputSchema.shape['mvp_k_count'].default(null),
  mvp_ra_count: playDocInputSchema.shape['mvp_ra_count'].default(null),
  mvp_outs_pitched_count:
    playDocInputSchema.shape['mvp_outs_pitched_count'].default(null),
  mvp_is_visiting_team:
    playDocInputSchema.shape['mvp_is_visiting_team'].default(null),

  // 裁判
  umpire_hp: playDocInputSchema.shape['umpire_hp'].default(null),
  umpire_1b: playDocInputSchema.shape['umpire_1b'].default(null),
  umpire_2b: playDocInputSchema.shape['umpire_2b'].default(null),
  umpire_3b: playDocInputSchema.shape['umpire_3b'].default(null),
  umpire_lf: playDocInputSchema.shape['umpire_lf'].default(null),
  umpire_rf: playDocInputSchema.shape['umpire_rf'].default(null),

  half_innings: playDocInputSchema.shape['half_innings'].default({}),
  created_at: fsTimestampSchemaOutput,
  updated_at: fsTimestampSchemaOutput,

  source: playStoreSchema.shape.source.default({}),
}) satisfies SchemaFromInterface<GamePlayDocOutput>;

export const toDoc = (
  gamePlayStore: GamePlayStore,
  {
    createdAt,
    updatedAt,
  }: {
    createdAt: GamePlayDocInput['created_at'];
    updatedAt: GamePlayDocInput['updated_at'];
  }
) => {
  const half_innings = Types.fromArrToFsMap(
    gamePlayStore.halfInnings.map((i) => {
      return {
        id: i.id,
        inning_no: i.inningNo,
        half_inning: i.halfInning,
        // 以上為必填欄位，下面都可以是選填
        offense_team_code: i.offenseTeamCode,
        defense_team_code: i.defenseTeamCode,
        score_count: i.scoreCount,
        hit_count: i.hitCount,
        error_count: i.errorCount,
        start_pitch_id: i.startPitchId,
        end_pitch_id: i.endPitchId,
        source: i.source,
      } satisfies GamePlayDocInput['half_innings'][number];
    })
  );

  console.log('half_innings', half_innings);

  // return

  const inputDoc: GamePlayDocInput = {
    id: gamePlayStore.id,
    game_id: gamePlayStore.gameId,
    field: gamePlayStore.field,
    start_datetime: gamePlayStore.startDatetime,
    end_datetime: gamePlayStore.endDatetime,

    // 比賽狀態
    home_score: gamePlayStore.homeScore,
    visiting_score: gamePlayStore.visitingScore,
    result: gamePlayStore.result,
    reserve_date: gamePlayStore.reserveDate,
    duration_seconds: gamePlayStore.durationSeconds,
    is_game_stop: gamePlayStore.isGameStop,
    is_play_ball: gamePlayStore.isPlayBall,
    audience_count: gamePlayStore.audienceCount,

    // 球員資訊
    closer_id: gamePlayStore.closerId,
    closer_name: gamePlayStore.closerName,
    home_pitcher_id: gamePlayStore.homePitcherId,
    home_pitcher_name: gamePlayStore.homePitcherName,
    loser_pitcher_id: gamePlayStore.loserPitcherId,
    loser_pitcher_name: gamePlayStore.loserPitcherName,
    visiting_pitcher_id: gamePlayStore.visitingPitcherId,
    visiting_pitcher_name: gamePlayStore.visitingPitcherName,
    winning_pitcher_id: gamePlayStore.winningPitcherId,
    winning_pitcher_name: gamePlayStore.winningPitcherName,
    winning_rbi_hitter_id: gamePlayStore.winningRbiHitterId,

    // MVP 資訊
    mvp_count: gamePlayStore.mvpCount,
    mvp_player_id: gamePlayStore.mvpPlayerId,
    mvp_player_name: gamePlayStore.mvpPlayerName,
    mvp_ab_count: gamePlayStore.mvpAbCount,
    mvp_rbi_count: gamePlayStore.mvpRbiCount,
    mvp_run_count: gamePlayStore.mvpRunCount,
    mvp_hit_count: gamePlayStore.mvpHitCount,
    mvp_home_run_count: gamePlayStore.mvpHomeRunCount,
    mvp_k_count: gamePlayStore.mvpKCount,
    mvp_ra_count: gamePlayStore.mvpRaCount,
    mvp_outs_pitched_count: gamePlayStore.mvpOutsPitchedCount,
    mvp_is_visiting_team: gamePlayStore.mvpIsVisitingTeam,

    // 裁判
    umpire_hp: gamePlayStore.umpireHp,
    umpire_1b: gamePlayStore.umpire1b,
    umpire_2b: gamePlayStore.umpire2b,
    umpire_3b: gamePlayStore.umpire3b,
    umpire_lf: gamePlayStore.umpireLf,
    umpire_rf: gamePlayStore.umpireRf,

    half_innings,
    source: gamePlayStore.source,

    created_at: createdAt,
    updated_at: updatedAt,
  };
  

  return playDocInputSchema.parse(inputDoc, { reportInput: true });
};

export const toStore = (gamePlayDoc: GamePlayDocOutput): GamePlayStore => {
  const store: GamePlayStore = {
    // 基本資訊
    gameId: gamePlayDoc.game_id,
    id: gamePlayDoc.id,
    field: gamePlayDoc.field,
    startDatetime: gamePlayDoc.start_datetime,
    endDatetime: gamePlayDoc.end_datetime,

    // 比賽狀態
    isGameStop: gamePlayDoc.is_game_stop,
    isPlayBall: gamePlayDoc.is_play_ball,
    result: gamePlayDoc.result,
    durationSeconds: gamePlayDoc.duration_seconds,
    homeScore: gamePlayDoc.home_score,
    visitingScore: gamePlayDoc.visiting_score,
    reserveDate: gamePlayDoc.reserve_date,
    // 還沒統計會是 null
    audienceCount: gamePlayDoc.audience_count,

    // 球員資訊
    visitingPitcherId: gamePlayDoc.visiting_pitcher_id,
    visitingPitcherName: gamePlayDoc.visiting_pitcher_name,
    homePitcherId: gamePlayDoc.home_pitcher_id,
    homePitcherName: gamePlayDoc.home_pitcher_name,
    winningPitcherId: gamePlayDoc.winning_pitcher_id,
    winningPitcherName: gamePlayDoc.winning_pitcher_name,
    loserPitcherId: gamePlayDoc.loser_pitcher_id,
    loserPitcherName: gamePlayDoc.loser_pitcher_name,
    closerId: gamePlayDoc.closer_id,
    closerName: gamePlayDoc.closer_name,
    winningRbiHitterId: gamePlayDoc.winning_rbi_hitter_id,

    // MVP 資訊
    mvpPlayerId: gamePlayDoc.mvp_player_id,
    mvpPlayerName: gamePlayDoc.mvp_player_name,
    mvpCount: gamePlayDoc.mvp_count,
    mvpAbCount: gamePlayDoc.mvp_ab_count,
    mvpRbiCount: gamePlayDoc.mvp_rbi_count,
    mvpRunCount: gamePlayDoc.mvp_run_count,
    mvpHomeRunCount: gamePlayDoc.mvp_home_run_count,
    mvpHitCount: gamePlayDoc.mvp_hit_count,
    // 投手三振次數
    mvpKCount: gamePlayDoc.mvp_k_count,
    mvpRaCount: gamePlayDoc.mvp_ra_count,
    mvpOutsPitchedCount: gamePlayDoc.mvp_outs_pitched_count,
    mvpIsVisitingTeam: gamePlayDoc.mvp_is_visiting_team,

    // 裁判
    umpireHp: gamePlayDoc.umpire_hp,
    umpire1b: gamePlayDoc.umpire_1b,
    umpire2b: gamePlayDoc.umpire_2b,
    umpire3b: gamePlayDoc.umpire_3b,
    umpireLf: gamePlayDoc.umpire_lf,
    umpireRf: gamePlayDoc.umpire_rf,

    // 局數顯示，用在 scoreboard
    halfInnings: Object.entries(gamePlayDoc.half_innings)
      .sort(([keyA], [keyB]) => +keyA - +keyB)
      .map(([, value]) => {
        return {
          id: value.id,
          inningNo: value.inning_no,
          halfInning: value.half_inning,
          offenseTeamCode: value.offense_team_code,
          defenseTeamCode: value.defense_team_code,
          scoreCount: value.score_count,
          hitCount: value.hit_count,
          errorCount: value.error_count,
          startPitchId: value.start_pitch_id,
          endPitchId: value.end_pitch_id,
          source: value.source,
        };
      }),
    source: gamePlayDoc.source,
  };

  const validStore = playStoreSchema.parse(store, { reportInput: true });

  return validStore;
};
