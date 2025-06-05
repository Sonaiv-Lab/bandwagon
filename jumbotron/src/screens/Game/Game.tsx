import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SimplifyUni } from "#/components/icons";

const Team = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <SimplifyUni width={"60"} height={"60"} />
      <Text style={{ fontSize: 16, marginTop: 6 }}>統一獅</Text>
      <Text style={styles.textSecondary}>12 - 5</Text>
    </View>
  );
};


const Block = ({ style, ...props }: React.ComponentProps<typeof View>) => {
  return (
    <View
      style={[{
        flexDirection: "row",
        width: "100%",
        padding: 20,
        justifyContent: "space-between",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        shadowOpacity: 25,
        shadowColor: "#ababab",
        boxShadow: "0px 2px 6px 0px #ababab",
      }, style]}
      {...props}
    />
  );
};

const Duel = () => {
  return (
    <Block
      style={{
        borderLeftWidth: 5,
        borderLeftColor: "#FB9611",
        borderRightWidth: 5,
        borderRightColor: "#FECF11",
      }}
    >
      <Team />
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>14:30</Text>
        <Text
          style={{
            fontSize: 16,
            textDecorationLine: "underline",
            marginBottom: 4,
          }}
        >
          台中洲際棒球場
        </Text>
        <Text style={{ fontSize: 24, marginBottom: 12, color: "#979393" }}>
          vs
        </Text>
      </View>
      <Team />
    </Block>
  );
};


const Pitcher = () => {
  return <View style={{ paddingHorizontal: 20, flexDirection: 'column', alignItems: 'center' }}>
    <Text style={{fontSize: 24, marginBottom: 10}}>高鹽將樹</Text>
    <Text style={styles.textSecondary}>ERA 0.0</Text>
    <Text style={styles.textSecondary}>1 - 5</Text>
  </View>
}

const StarterPitchers = () => {
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

export function Game() {
  return (
    <View
      style={{
        flexDirection: "column",
        paddingVertical: 10,
        paddingHorizontal: 17,
        gap: 12,
      }}
    >
      <Duel />
      <StarterPitchers />
    </View>
  );
}

const styles = StyleSheet.create({
  textSecondary: { fontSize: 14, color: "#979393" },
});
