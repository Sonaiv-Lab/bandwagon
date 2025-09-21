import { z } from 'zod';

export const TEAMS_INFO = {
  ADD011: {
    code: 'ADD011',
    fullName: '統一7-ELEVEn獅',
    name: '統一獅',
    theme: {
      color: '#FB9611',
    },
  },
  AKP011: {
    code: 'AKP011',
    fullName: '台鋼雄鷹',
    name: '台鋼雄鷹',
    theme: {
      color: '#0F7A26',
    },
  },
  ACN011: {
    code: 'ACN011',
    fullName: '中信兄弟',
    name: '中信兄弟',
    theme: {
      color: '#FECF11',
    },
  },
  AEO011: {
    code: 'AEO011',
    fullName: '富邦悍將',
    name: '富邦悍將',
    theme: {
      color: '#2286DD',
    },
  },
  AJL011: {
    code: 'AJL011',
    fullName: '樂天桃猿',
    name: '樂天桃猿',
    theme: {
      color: '#9B123D',
    },
  },
  AAA011: {
    code: 'AAA011',
    fullName: '味全龍',
    name: '味全龍',
    theme: {
      color: '#FF393C',
    },
  },
} as const;

export type TeamCodeValue = keyof typeof TEAMS_INFO;

export type TeamInfo = (typeof TEAMS_INFO)[TeamCodeValue];

const teamCodes = Object.keys(TEAMS_INFO) as TeamCodeValue[];

export const teamCodeSchema = z.enum(teamCodes as [TeamCodeValue]);

const teamFullNames = Object.values(TEAMS_INFO).map(({ fullName }) => fullName);

type TeamFullName = (typeof TEAMS_INFO)[TeamCodeValue]['fullName'];

//  as [TeamFullName] is zod cheating
export const teamFullNamesSchema = z.enum(teamFullNames as [TeamFullName]);
