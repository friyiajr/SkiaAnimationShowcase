import {
  Easing,
  runTiming,
  useFont,
  useValue,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { PixelRatio, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GranTurismoCountdown } from "./GranTurismoCountdown";

const radius = PixelRatio.roundToNearestPixel(150);
const STROKE_WIDTH = 7;

export const GranTurismo = () => {
  // TODO: Make targetPercentage 1 when the newest Skia version 0.190.0 is
  // released on Expo GO. Saturate was recommended as a workaround but for
  // this use case it was easier to just use a slightly lower number
  // than 1
  //
  // See - https://github.com/Shopify/react-native-skia/issues/1584
  const targetPercentage = 0.995;
  const animationState = useValue(0);
  const iteration = useValue(3);
  const isIterationComplete = useValue(false);
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);

  const resetState = () => {
    animationState.current = 0;
    iteration.current = 3;
    isIterationComplete.current = false;
    setIsAnimationCompleted(false);
  };

  const animateChart = () => {
    runTiming(
      animationState,
      isIterationComplete.current ? 0 : 1,
      {
        duration: 1000,
        easing: Easing.inOut(Easing.exp),
      },
      () => {
        isIterationComplete.current = !isIterationComplete.current;
        iteration.current -= 1;
        if (iteration.current > 0) {
          animateChart();
        } else {
          setIsAnimationCompleted(true);
        }
      }
    );
  };

  const font = useFont(require("../../../bruno.ttf"), 110);
  const startFont = useFont(require("../../../bruno.ttf"), 60);

  if (!font || !startFont) {
    return <View />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ringChartContainer}>
        <GranTurismoCountdown
          backgroundColor="white"
          radius={radius}
          strokeWidth={STROKE_WIDTH}
          percentageComplete={animationState}
          targetPercentage={targetPercentage}
          font={font}
          isIterationComplete={isIterationComplete}
          iteration={iteration}
          startFont={startFont}
        />
      </View>
      <TouchableOpacity
        onPress={isAnimationCompleted ? resetState : animateChart}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {isAnimationCompleted ? "PRESS TO RESET" : "PRESS TO ANIMATE"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  ringChartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default GranTurismo;
