import React from "react";
import { View, StyleSheet } from "react-native";
import { ExpoPulse } from "./ExpoPulse";

export const ExpoPulseContainer = () => {
  return (
    <View style={styles.container}>
      <ExpoPulse />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
  },
});
