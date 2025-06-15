import { TeamCode } from "@bandwagon/shared/constants/teams";
import { SvgProps } from "react-native-svg";

import SimplifyUni from "#/assets/icons/simplify-icon-uni.svg";
import SimplifyFubon from "#/assets/icons/simplify-icon-fubon.svg";
import SimplifyRokuten from "#/assets/icons/simplify-icon-rokuten.svg";
import SimplifyTsg from "#/assets/icons/simplify-icon-tsg.svg";
import SimplifyWeichuan from "#/assets/icons/simplify-icon-weichuan.svg";
import SimplifyBrother from "#/assets/icons/simplify-icon-brother.svg";

type Visual = {
  simplifyIcon: React.FC<SvgProps>
}

export const TEAMS_VISUAL = {
  ADD011: {
    simplifyIcon: SimplifyUni,
  },
  AKP011: {
    simplifyIcon: SimplifyTsg,
  },
  ACN011: {
    simplifyIcon: SimplifyBrother,
  },
  AEO011: {
    simplifyIcon: SimplifyFubon,
  },
  AJL011: {
    simplifyIcon: SimplifyRokuten,
  },
  AAA011: {
    simplifyIcon: SimplifyWeichuan,
  },
} satisfies Record<TeamCode, Visual>;