import React from "react";
import { View, StyleSheet } from "react-native";
import { VitalSignMonitor } from "./VitalSignMonitor";

export const VitalSignMonitorContainer = () => {
  return (
    <View style={styles.container}>
      <VitalSignMonitor />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
});
