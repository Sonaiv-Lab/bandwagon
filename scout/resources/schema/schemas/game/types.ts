import type { GamePlay, Game } from '#shared/model/game';

export type GameInfo = Omit<Game, 'plays' | 'id'>;

export type GamePlayInfo = Omit<GamePlay, 'id'>