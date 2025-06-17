import React from "react";
import { Pressable, View } from "react-native";
import Icon from "@react-native-vector-icons/material-design-icons";
import { Text } from "react-native-paper";
import Svg, { Path, Text as SVGText } from "react-native-svg";
import type { GameSummary } from "@bandwagon/shared/modules/schedule";
import { TeamCode, TEAMS_INFO } from "@bandwagon/shared/constants/teams";
import { FIELDS } from "@bandwagon/shared/constants/fieldOpts";
import { DateTime } from "luxon";
import { useTheme } from "@react-navigation/native";

export const LargeGameChip = (
  { onPress, gameSummary }: { onPress; gameSummary: GameSummary },
) => {
  const homeTeam = TEAMS_INFO[gameSummary.homeTeamCode as TeamCode];
  const visitingTeam = TEAMS_INFO[gameSummary.visitingTeamCode as TeamCode];
  const timeString = DateTime.fromISO(gameSummary.startDatetime).toFormat(
    "HH:mm",
  );

  const theme = useTheme()
  const textColor = theme.colors.text
  
  return (
    <Pressable
      style={{
        flexDirection: "column",
        gap: 6,
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
        paddingHorizontal: 24,
        paddingVertical: 12,
        paddingBottom: 18,
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, color: textColor }}>{`No.${gameSummary.gameNo}`}</Text>
        <Text style={{ fontSize: 14, flexGrow: 1, textAlign: "center", color: textColor }}>
          {`${FIELDS[gameSummary.field].name} ${timeString}`}
          {/* {`${'123123'} ${timeString}`} */}
        </Text>
        <Icon
          name="chevron-right"
          size={24}
          style={{ paddingTop: 0, paddingLeft: 20 }}
        />
      </View>
      <View style={{height: 44}}>
        <Svg width="100%" height="44" viewBox="0 0 362 44">
        <Path
            d="M186.376 18.8729H168.326L176.366 43.4068H6.01662C2.69374 43.4068 1.61516e-07 40.7168 0 37.3985V6.35554C1.61515e-07 3.03724 2.69373 0.347229 6.01662 0.347229H180.305L186.376 18.8729Z"
            fill={homeTeam.theme.color}
          />
          <Path
            d="M355.983 0.347229C359.306 0.347233 362 3.03724 362 6.35554V37.3985C362 40.7168 359.306 43.4068 355.983 43.4068H182.698L176.627 24.8812H194.676L186.637 0.347229H355.983Z"
            fill={visitingTeam.theme.color}
          />
        </Svg>
        <Text
          style={{
            fontSize: 16,
            left: 10,
            top: 22,
            transform: [{ translateY: -11 }],
            position: "absolute",
            color: theme.colors.background,
          }}
        >
          {homeTeam.name}
        </Text>
        <Text
          style={{
            fontSize: 16,
            right: 10,
            top: 22,
            transform: [{ translateY: -11 }],
            position: "absolute",
            color: theme.colors.background,
          }}
        >
          {visitingTeam.name}
        </Text>
      </View>
    </Pressable>
  );
};
