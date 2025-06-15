import { Game as GameScreen } from "#/screens";
import { useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import { useDailySchedule } from "#/data/schedule/daily";
import { pipe } from "fp-ts/function";
import Icon from "@react-native-vector-icons/material-design-icons";
import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import { DateTime } from "luxon";
import { toFullShort } from "#/utils/datetime";

const Header = ({ route }) => {
  const navigation = useNavigation();

  console.log("Game: route ", route);

  const gameId = route.params.gameId;
  const year = route.params.competitionYear;

  const { data: daily = {} } = useDailySchedule({ year: String(year) });

  console.log("daily", daily);

  const flattenedGames = pipe(
    daily,
    R.toEntries,
    A.flatMap(([date, games]) => games),
  );

  const currentGameIndex = flattenedGames.findIndex(
    ({ id }) => id === gameId,
  );

  const isPrevAvailable = currentGameIndex > 0;
  const isNextAvailable = currentGameIndex > -1 &&
    currentGameIndex + 1 <= flattenedGames.length - 1;

  const currentGame = flattenedGames[currentGameIndex]

  console.log("flattenedGames", flattenedGames);

  const toNext = () => {
    const nextGame = flattenedGames[currentGameIndex + 1]
    if (!nextGame) return

    navigation.setParams({
      gameId: nextGame.id
    });
  };

  const toPrev = () => {
    const prevGame = flattenedGames[currentGameIndex + 1]
    if (!prevGame) return

    navigation.setParams({
      gameId: prevGame.id
    });
  };

  const currentDate = toFullShort(DateTime.fromISO(currentGame.startDatetime))

  return (
    <Appbar.Header>
      <Appbar.Action
        icon="arrow-left"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Appbar.Action
        icon="chevron-left"
        disabled={!isPrevAvailable}
        onPress={toPrev}
      />
      <Appbar.Content
        titleStyle={{ textAlign: "center" }}
        title={currentDate}
      />
      <Appbar.Action
        icon="chevron-right"
        disabled={!isNextAvailable}
        onPress={toNext}
      />
      <Appbar.Action icon="view-list" onPress={() => {}} />
    </Appbar.Header>
  );
};

const Game = {
  screen: GameScreen,
  
  options: {
    header: (props) => <Header {...props} />,
    tabBarItemStyle: { display: "none" },
  },
} as const;

export { Game };
