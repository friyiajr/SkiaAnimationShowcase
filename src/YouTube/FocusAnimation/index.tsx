import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import {
  Blur,
  Canvas,
  SkFont,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const fontSize = 140;

interface LetterProps {
  text: string;
  spacingOffset: number;
  font: SkFont;
  fingerPosition: SharedValue<{ x: number; y: number }>;
  index: number;
}

const Letter = ({
  text,
  spacingOffset,
  font,
  fingerPosition,
  index,
}: LetterProps) => {
  const letterWidth = font.getTextWidth(text);

  const xPosition = (width - letterWidth) / 2;

  const blurValue = useDerivedValue(() => {
    const isInXRange =
      fingerPosition.value.x > xPosition &&
      fingerPosition.value.x < xPosition + letterWidth;

    const isInYRange =
      fingerPosition.value.y > spacingOffset * index - fontSize &&
      fingerPosition.value.y < spacingOffset * index;

    const isInRange = isInXRange && isInYRange;

    return withTiming(isInRange ? 0 : 15, {
      duration: 350,
      easing: Easing.linear,
    });
  }, [fingerPosition]);

  return (
    <Text
      text={text}
      x={xPosition}
      y={spacingOffset * index}
      font={font}
      color={"white"}
    >
      <Blur blur={blurValue} />
    </Text>
  );
};

export const FocusAnimation = () => {
  const font = useFont(require("../../../Roboto-Bold.ttf"), fontSize);

  const fingerPosition = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onBegin(({ x, y }) => {
      fingerPosition.value = { x, y };
    })
    .onChange(({ x, y }) => {
      fingerPosition.value = { x, y };
    })
    .onEnd(() => {
      fingerPosition.value = { x: 0, y: 0 };
    })
    .onFinalize(() => {
      fingerPosition.value = { x: 0, y: 0 };
    });

  if (!font) {
    return <View />;
  }

  const spacingOffset = height / 5 - 10;

  const message = "FOCUS".split("");

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          {message.map((char, index) => (
            <Letter
              key={index}
              text={char}
              spacingOffset={spacingOffset}
              font={font}
              fingerPosition={fingerPosition}
              index={index + 1}
            />
          ))}
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  canvas: {
    flex: 1,
    marginTop: 15,
  },
});
