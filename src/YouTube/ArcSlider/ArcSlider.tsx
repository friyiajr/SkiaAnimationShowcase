import {
  Canvas,
  Circle,
  Path,
  Rect,
  Skia,
  useSharedValueEffect,
  useValue,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { polar2Canvas } from "react-native-redash";

const { width, height } = Dimensions.get("window");

const ghost = require("./ghost.png");

export const ArcSlider = () => {
  const strokeWidth = 20;
  const center = width / 2;
  const r = (width - strokeWidth) / 2 - 40;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const x1 = center - r * Math.cos(startAngle);
  const y1 = -r * Math.sin(startAngle) + center;
  const x2 = center - r * Math.cos(endAngle);
  const y2 = -r * Math.sin(endAngle) + center;
  const rawPath = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;
  const rawForegroundPath = `M ${x2} ${y2} A ${r} ${r} 1 0 1 ${x1} ${y1}`;
  const skiaBackgroundPath = Skia.Path.MakeFromSVGString(rawPath);
  const skiaForegroundPath = Skia.Path.MakeFromSVGString(rawForegroundPath);

  const movableCx = useSharedValue(x2);
  const movableCy = useSharedValue(y2);
  const previousPositionX = useSharedValue(x2);
  const previousPositionY = useSharedValue(y2);
  const percentComplete = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate(({ translationX, translationY, absoluteX }) => {
      const oldCanvasX = translationX + previousPositionX.value;
      const oldCanvasY = translationY + previousPositionY.value;

      const xPrime = oldCanvasX - center;
      const yPrime = -(oldCanvasY - center);
      const rawTheta = Math.atan2(yPrime, xPrime);

      let newTheta;

      if (absoluteX < width / 2 && rawTheta < 0) {
        newTheta = Math.PI;
      } else if (absoluteX > width / 2 && rawTheta <= 0) {
        newTheta = 0;
      } else {
        newTheta = rawTheta;
      }

      const percent = 1 - newTheta / Math.PI;
      percentComplete.value = percent;

      const newCoords = polar2Canvas(
        {
          theta: newTheta,
          radius: r,
        },
        {
          x: center,
          y: center,
        }
      );

      movableCx.value = newCoords.x;
      movableCy.value = newCoords.y;
    })
    .onEnd(() => {
      previousPositionX.value = movableCx.value;
      previousPositionY.value = movableCy.value;
    });

  const style = useAnimatedStyle(() => {
    return { height: 200, width: 300, opacity: percentComplete.value };
  }, [percentComplete]);

  if (!skiaBackgroundPath || !skiaForegroundPath) {
    return <View />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <View style={styles.ghost}>
            <Animated.Image source={ghost} style={style} resizeMode="center" />
          </View>
          <Canvas style={styles.canvas}>
            <Rect x={0} y={0} width={width} height={height} color="black" />
            <Path
              path={skiaBackgroundPath}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              color={"grey"}
            />
            <Path
              path={skiaForegroundPath}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              color={"orange"}
              start={0}
              end={percentComplete}
            />
            <Circle
              cx={movableCx}
              cy={movableCy}
              r={20}
              color="orange"
              style="fill"
            />
            <Circle
              cx={movableCx}
              cy={movableCy}
              r={15}
              color="white"
              style="fill"
            />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  cursor: {
    backgroundColor: "green",
  },
  ghost: {
    flex: 2,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
