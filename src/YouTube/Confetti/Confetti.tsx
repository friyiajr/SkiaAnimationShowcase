import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import {
  Canvas,
  Group,
  RoundedRect,
  runTiming,
  Skia,
  useComputedValue,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import { processTransform3d, toMatrix3 } from "react-native-redash";

const colors = ["#deb7ff", "#c785ec", "#a86add", "#8549a7", "#634087"];

const NUM_OF_CONFETTI = 70;

const { height, width } = Dimensions.get("window");

const relativeSin = (yPosition: number, offsetId: number) => {
  const rand = Math.sin((yPosition - 500) * (Math.PI / 540));
  const otherrand = Math.cos((yPosition - 500) * (Math.PI / 540));
  return offsetId % 2 === 0 ? rand : -otherrand;
};

interface Offset {
  offsetId: string;
  startingXOffset: number;
  startingYOffset: number;
  colorCode: number;
}

const ConfettiPiece = ({
  startingXOffset,
  startingYOffset,
  offsetId,
  colorCode,
}: Offset) => {
  const WIDTH = 10;
  const HEIGHT = 30;
  const seed = Math.random() * 4;

  const centerY = useValue(0);
  const yPosition = useValue(startingYOffset);

  const origin = useComputedValue(() => {
    centerY.current = yPosition.current + HEIGHT / 2;
    const centerX = startingXOffset + WIDTH / 2;
    return vec(centerX, centerY.current);
  }, [yPosition]);

  runTiming(yPosition, height * 3, {
    duration: 3500,
  });

  const matrix = useComputedValue(() => {
    const rotateZ =
      relativeSin(yPosition.current, Math.round(Number(offsetId))) * seed * 2.5;
    const rotateY =
      relativeSin(yPosition.current, Math.round(Number(offsetId))) * seed * 1.5;
    const rotateX =
      relativeSin(yPosition.current, Math.round(Number(offsetId))) * seed * 1.5;
    const mat3 = toMatrix3(
      processTransform3d([
        { rotateY: rotateY },
        { rotateX: rotateX },
        { rotateZ: rotateZ },
      ])
    );

    return Skia.Matrix(mat3);
  }, [yPosition]);

  return (
    <Group matrix={matrix} origin={origin}>
      <RoundedRect
        r={8}
        x={startingXOffset}
        y={yPosition}
        height={WIDTH}
        width={HEIGHT}
        color={colors[colorCode]}
      />
    </Group>
  );
};

export const Confetti = () => {
  const [confettiPieces, setConfettiPieces] = useState<Offset[]>([]);

  const startAnimation = () => {
    const pieces: Offset[] = [];

    for (let i = 0; i < NUM_OF_CONFETTI; i++) {
      const startingXOffset = Math.random() * width;
      const startingYOffset = -Math.random() * (height * 3);
      const id = i + Math.random() + "";
      pieces.push({
        offsetId: id,
        startingXOffset,
        startingYOffset,
        colorCode: i % colors.length,
      });
    }

    setConfettiPieces(pieces);
  };

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        {confettiPieces.map((offset) => (
          <ConfettiPiece key={offset.offsetId} {...offset} />
        ))}
      </Canvas>
      <Text style={styles.title}>Congratulations!</Text>
      <Pressable onPress={startAnimation} style={styles.button}>
        <Text style={styles.buttonText}>START</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    position: "absolute",
    top: "45%",
    textAlign: "center",
    width: "100%",
    fontSize: 40,
    color: "black",
    fontWeight: "bold",
  },
  button: {
    height: 60,
    backgroundColor: "purple",
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
