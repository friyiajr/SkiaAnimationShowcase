import {
  Easing,
  runTiming,
  useFont,
  useValue,
} from "@shopify/react-native-skia";
import React from "react";
import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import { DonutChart } from "./DonutChart";

const radius = PixelRatio.roundToNearestPixel(130);
const STROKE_WIDTH = 12;

export const DonutChartContainer = () => {
  const targetPercentage = 85 / 100;
  const animationState = useValue(0);

  const animateChart = () => {
    animationState.current = 0;
    runTiming(animationState, targetPercentage, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const font = useFont(require("../../Roboto-Light.ttf"), 60);
  const smallerFont = useFont(require("../../Roboto-Light.ttf"), 25);

  if (!font || !smallerFont) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.ringChartContainer}>
        <DonutChart
          backgroundColor="purple"
          radius={radius}
          strokeWidth={STROKE_WIDTH}
          percentageComplete={animationState}
          targetPercentage={targetPercentage}
          font={font}
          smallerFont={smallerFont}
        />
      </View>
      <Pressable onPress={animateChart} style={styles.button}>
        <Text style={styles.buttonText}>Animate !</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  ringChartContainer: {
    width: radius * 2,
    height: radius * 2,
  },
  button: {
    marginTop: 40,
    backgroundColor: "orange",
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default DonutChartContainer;
