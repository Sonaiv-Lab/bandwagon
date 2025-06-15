import { Text, View } from "react-native";
import { Block, gameScreenStyles } from "./ui";
import { Color } from "shared/types";
import { SvgProps } from "react-native-svg";

type TeamInfo = {
  color: Color;
  name: string;
  Icon: React.FC<SvgProps> | undefined
};

const Team = ({ name, Icon }: Pick<TeamInfo, "name" | "Icon">) => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
      }}
    >
      {Icon && <Icon width={"60"} height={"60"} />}
      <Text style={{ fontSize: 16, marginTop: 6 }}>{name}</Text>
      {/* <Text style={gameScreenStyles.textSecondary}>12 - 5</Text> */}
    </View>
  );
};

export const Duel = (
  { leftTeam, rightTeam, fieldName, timeString, gameNo }: {
    leftTeam: TeamInfo;
    rightTeam: TeamInfo;
    fieldName: string;
    timeString: string
    gameNo: string
  },
) => {
  return (
    <Block
      style={{
        borderLeftWidth: 5,
        borderLeftColor: leftTeam.color,
        borderRightWidth: 5,
        borderRightColor: rightTeam.color,
      }}
    >
      <Team name={leftTeam.name} Icon={leftTeam.Icon} />
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>{timeString}</Text>
        <Text
          style={{
            fontSize: 16,
            textDecorationLine: "underline",
            marginBottom: 4,
          }}
        >
          {fieldName}
        </Text>
        <Text style={{ fontSize: 24, marginBottom: 4, color: "#979393" }}>
          vs
        </Text>
        {gameNo && <Text style={{ fontSize: 14}}>
          {`No.${gameNo}`}
        </Text>}
      </View>
      <Team name={rightTeam.name} Icon={rightTeam.Icon} />
    </Block>
  );
};
