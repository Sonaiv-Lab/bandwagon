import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Duel } from "./Duel";
import { useGame } from "#/data/games";
import { FIELDS } from "@bandwagon/shared/constants/fieldOpts";
import { TeamInfo, TEAMS_INFO } from "@bandwagon/shared/constants/teams";
import { DateTime } from "luxon";
import { TEAMS_VISUAL } from "#/constants/teamsVisual";

export function Game({ route }) {
  const gameId = route.params.gameId;

  const { data: game } = useGame({ id: gameId });

  const fieldName = game?.field ? FIELDS[game.field].name : "";
  const homeTeam = game?.homeTeamCode
    ? TEAMS_INFO[game.homeTeamCode]
    : undefined;
  const visitingTeam = game?.visitingTeamCode
    ? TEAMS_INFO[game.visitingTeamCode]
    : undefined;

  const datetimeString = game?.startDatetime ? DateTime.fromISO(game.startDatetime).setLocale("zh")
    .toFormat("HH:mm") : ""


  const leftIcon = game?.homeTeamCode ? TEAMS_VISUAL[game.homeTeamCode].simplifyIcon : undefined
  const rightIcon = game?.visitingTeamCode ? TEAMS_VISUAL[game.visitingTeamCode].simplifyIcon : undefined

  

  return (
    <View
      style={{
        flexDirection: "column",
        paddingVertical: 10,
        paddingHorizontal: 17,
        gap: 12,
      }}
    >
      {homeTeam && visitingTeam && (
        <Duel
          timeString={datetimeString}
          fieldName={fieldName}
          gameNo={String(game?.gameNo)}
          leftTeam={{
            name: homeTeam.name,
            color: homeTeam.theme.color,
            Icon: leftIcon
          }}
          rightTeam={{
            name: visitingTeam.name,
            color: visitingTeam.theme.color,
            Icon: rightIcon
          }}
        />
      )}

      {/* <StarterPitchers /> */}
    </View>
  );
}
