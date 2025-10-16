import z from "zod";

type DefensePosInfo = {
  abbrevCode: string;
  recordCode: string;
  fullName: {
    en: string;
    zh_TW: string;
  };
};


const DEFENSE_POS = {
  P: {
    abbrevCode: 'P',
    recordCode: '1',
    fullName: {
      en: 'Pitcher',
      zh_TW: '投手',
    },
  },
  C: {
    abbrevCode: 'C',
    recordCode: '2',
    fullName: {
      en: 'Catcher',
      zh_TW: '捕手',
    },
  },
  '1B': {
    abbrevCode: '1B',
    recordCode: '3',
    fullName: {
      en: 'First Baseman',
      zh_TW: '一壘手',
    },
  },
  '2B': {
    abbrevCode: '2B',
    recordCode: '4',
    fullName: {
      en: 'Second Baseman',
      zh_TW: '二壘手',
    },
  },
  '3B': {
    abbrevCode: '3B',
    recordCode: '5',
    fullName: {
      en: 'Third Baseman',
      zh_TW: '三壘手',
    },
  },
  SS: {
    abbrevCode: 'SS',
    recordCode: '6',
    fullName: {
      en: 'Shortstop',
      zh_TW: '游擊手',
    },
  },
  LF: {
    abbrevCode: 'LF',
    recordCode: '7',
    fullName: {
      en: 'Left Fielder',
      zh_TW: '左外野手',
    },
  },
  CF: {
    abbrevCode: 'CF',
    recordCode: '8',
    fullName: {
      en: 'Center Fielder',
      zh_TW: '中外野手',
    },
  },
  RF: {
    abbrevCode: 'RF',
    recordCode: '9',
    fullName: {
      en: 'Right Fielder',
      zh_TW: '右外野手',
    },
  },
  DH: {
    abbrevCode: 'DH',
    recordCode: '',
    fullName: {
      en: 'Designated Hitter',
      zh_TW: '指定打擊',
    },
  },
  PH: {
    abbrevCode: 'PH',
    recordCode: '',
    fullName: {
      en: 'Pinch Hitter',
      zh_TW: '代打',
    },
  },
  PR: {
    abbrevCode: 'PR',
    recordCode: '',
    fullName: {
      en: 'Pinch Runner',
      zh_TW: '代跑',
    },
  },
} as const satisfies {
  [index: DefensePosInfo['abbrevCode']]: DefensePosInfo;
};


export const defensePosAbbrevCodeSchema = z.enum(
  Object.values(DEFENSE_POS).map((p) => p.abbrevCode)
);

export const defensePosRecordCodeSchema = z.enum(
  Object.values(DEFENSE_POS).map((p) => p.recordCode)
);