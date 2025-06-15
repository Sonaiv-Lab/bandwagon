import { StyleSheet, Text, View } from "react-native";
import { gameScreenStyles, Block } from "./ui";

const Pitcher = () => {
  return <View style={{ paddingHorizontal: 20, flexDirection: 'column', alignItems: 'center' }}>
    <Text style={{fontSize: 24, marginBottom: 10}}>高鹽將樹</Text>
    <Text style={gameScreenStyles.textSecondary}>ERA 0.0</Text>
    <Text style={gameScreenStyles.textSecondary}>1 - 5</Text>
  </View>
}

export const StarterPitchers = () => {
  return (
    <Block
      style={{
        borderLeftWidth: 5,
        borderLeftColor: "#FB9611",
        borderRightWidth: 5,
        borderRightColor: "#FECF11",
      }}
    >
      <Pitcher />
      <Pitcher />
     
    </Block>
  );
};