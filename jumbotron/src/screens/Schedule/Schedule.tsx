import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { Text } from "react-native-paper";
import { BottomSheetMethods, DynamicBottomSheet } from "./DynamicBottomSheet";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import { useDailySchedule } from "#/data/schedule";
import { DateTime } from "luxon";
import { Calendar, Label } from "#/components/Calendar";
import { TeamCode, TEAMS_INFO } from "@bandwagon/shared/constants/teams";
import { ISODateTimeString } from "shared/types";
import { LargeGameChip } from "#/components/LargeGameChip";
import { GameChip } from "#/components/GameChip";
import { toYYYY_MM_DD_CCCC } from "#/utils/datetime";

/**
 * TODO: 後續再作類似 google calendar 可以透過拖曳看前後個月
 */
export const Schedule = () => {
  const navigation = useNavigation();
  const {
    params: { current },
  } = useRoute();
  const bottomSheetModalRef = useRef<BottomSheetMethods>(null);

  const currentDateTime = DateTime.fromISO(current);

  const currentYear = currentDateTime.get("year");

  const { data: schedule = {} } = useDailySchedule({
    year: String(currentYear),
  });
  const [selectedDate, setSelectedDate] = useState<ISODateTimeString>();

  const selectedDateString = toYYYY_MM_DD_CCCC(DateTime.fromISO(selectedDate ?? ""))

  const theme = useTheme()

  const fromDate = currentDateTime.startOf("month");
  const toDate = currentDateTime.endOf("month");

  console.log("Schedule - reoute", { schedule });

  const onPressGame = ({ gameId, year }) => {
    bottomSheetModalRef.current?.close();
    navigation.navigate("Game", { gameId,  competitionYear: year})
  };

  const selectedDateGames = selectedDate ? schedule?.[selectedDate] : [];

  useEffect(() => {
    if (selectedDate) {
      bottomSheetModalRef.current?.expand();
    }
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      if (!selectedDate) {
        bottomSheetModalRef.current?.close();
      }
      return () => {
        setSelectedDate(undefined);
      };
    }, [setSelectedDate]),
  );

  const bottomSheetGames = useMemo(() => {
    return selectedDateGames.map((game) => {
      return (
        <LargeGameChip
          key={game.id}
          onPress={() => {
            onPressGame({gameId: game.id, year: currentYear});
          }}
          gameSummary={game}
        />
      );
    });
  }, [onPressGame, selectedDateGames]);

  return (
    <>
      <SafeAreaView style={{ flexDirection: "column", flex: 1 }}>
        <Calendar
          from={fromDate}
          to={toDate}
          renderCellProps={(dateTime) => {
            const date = dateTime.toISODate() ?? "";
            const games = schedule?.[date] ?? [];

            const gamesChips = games.map(
              ({ visitingTeamCode, homeTeamCode }) => {
                // ... actually, it may be undefined, use as here is cheating
                const colorL = TEAMS_INFO?.[homeTeamCode as TeamCode]?.theme
                  .color;
                const colorR = TEAMS_INFO?.[visitingTeamCode as TeamCode]?.theme
                  .color;

                return (
                  <GameChip
                    key={homeTeamCode}
                    colorL={colorL}
                    colorR={colorR}
                  />
                );
              },
            );

            return {
              label: <Label>{dateTime.get("day")}</Label>,
              children: (
                <Pressable
                  onPress={() => {
                    date !== "" && setSelectedDate(date);
                  }}
                >
                  <View
                    style={{
                      overflow: "hidden",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    {gamesChips}
                  </View>
                </Pressable>
              ),
            };
          }}
        />
      </SafeAreaView>
      {/* 這裡可以的話給固定高度，會比較好，發現他會長昂 render 錯誤 */}
      <DynamicBottomSheet
        bottomSheetRef={bottomSheetModalRef}
        onChange={(val) => {
          const isBottomSheetClose = val === -1;
          if (isBottomSheetClose) {
            setSelectedDate(undefined);
          }
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            borderBottomColor: theme.colors.border,
            borderBottomWidth: 1,
            textAlign: "center",
            paddingTop: 0,
            paddingBottom: 10,
            fontSize: 16,
          }}
        >
          {selectedDateString}
        </Text>
        {bottomSheetGames}
      </DynamicBottomSheet>
    </>
  );
};
