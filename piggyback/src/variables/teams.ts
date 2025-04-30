import { z } from 'zod';



const TEAMS = {
  ADD011: '統一7-ELEVEn獅',
  ACN011: '中信兄弟',
  AJL011: '樂天桃猿',
  AAA011: '味全龍',
  AEO011: '富邦悍將',
  AKP011: '台鋼雄鷹',
} as const;

type Teams = (typeof TEAMS)[keyof typeof TEAMS];

type TeamCodes = keyof typeof TEAMS;

const teams = [...Object.values(TEAMS)]

const teamCodes = [...Object.keys(TEAMS)]

const TeamsScheme = z.enum(teams as [Teams, ...Teams[]]);

const TeamCodesScheme = z.enum(teamCodes as [TeamCodes, ...TeamCodes[]]);


export default TEAMS;
export { teams, teamCodes, TeamsScheme, TeamCodesScheme };
export type { TeamCodes, Teams };
