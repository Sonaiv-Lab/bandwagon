import { StyleSheet, View } from "react-native";


export const gameScreenStyles = StyleSheet.create({
  textSecondary: { fontSize: 14, color: "#979393" },
});


export const Block = ({ style, ...props }: React.ComponentProps<typeof View>) => {
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
