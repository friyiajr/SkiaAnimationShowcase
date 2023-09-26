import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { Canvas, Circle, Shadow } from "@shopify/react-native-skia";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { ReText } from "react-native-redash";

export const NeumorphicButton = () => {
  const isPressed = useSharedValue(false);
  const blur = useSharedValue(4);
  const statusText = useSharedValue("OFF");

  const animateButton = () => {
    "worklet";
    blur.value = withTiming(
      1.5,
      {
        duration: 400,
        easing: Easing.linear,
      },
      () => {
        isPressed.value = !isPressed.value;
        blur.value = withTiming(
          !isPressed.value ? 7 : 4,
          {
            duration: 400,
            easing: Easing.linear,
          },
          () => {
            statusText.value = isPressed.value ? "ON" : "OFF";
          }
        );
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReText text={statusText} style={styles.textStyle} />
      <Canvas style={styles.canvas} onTouchStart={animateButton}>
        <Circle cx={135} cy={125} r={100} color="white">
          <Shadow dx={0.2} dy={0.2} blur={5} color="#D3D3D3" inner />
        </Circle>
        <Circle cx={135} cy={125} r={70} color="white">
          <Shadow dx={1} dy={1} blur={blur} color="#D3D3D3" inner={isPressed} />
          <Shadow
            dx={-1}
            dy={-1}
            blur={blur}
            color="#D3D3D3"
            inner={isPressed}
          />
        </Circle>
      </Canvas>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  canvas: {
    height: 275,
    width: 275,
  },
  textStyle: {
    fontSize: 80,
    marginTop: -30,
    fontWeight: "200",
    textAlign: "center",
  },
});
