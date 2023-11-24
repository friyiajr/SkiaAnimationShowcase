import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View, Text, SafeAreaView } from "react-native";

import {
  Canvas,
  Circle,
  Line,
  Path,
  Rect,
  RoundedRect,
  Skia,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const canvasWidth = width;
const canvasHeight = height;

export const GradientClock = () => {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}></Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  canvas: {
    width: canvasWidth,
    height: canvasHeight,
  },
  dayText: {
    position: "absolute",
    top: 70,
    fontWeight: "100",
    letterSpacing: 8,
    fontSize: 90,
    color: "black",
    alignSelf: "center",
  },
  nightText: {
    position: "absolute",
    bottom: 70,
    fontWeight: "100",
    letterSpacing: 8,
    fontSize: 90,
    color: "white",
    alignSelf: "center",
  },
});
