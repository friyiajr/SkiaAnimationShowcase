import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  Canvas,
  Circle,
  Group,
  Line,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { processTransform3d, toMatrix3 } from "react-native-redash";
import { Text } from "react-native";

const getInnerColor = (idx: number) => {
  if (idx >= 0 && idx <= 5) {
    return "yellow";
  } else if (idx >= 5 && idx <= 10) {
    return "lime";
  } else if (idx >= 10 && idx <= 15) {
    return "aqua";
  } else {
    return "blue";
  }
};

const getOuterColor = (idx: number) => {
  if (idx >= 0 && idx <= 5) {
    return "blue";
  } else if (idx >= 5 && idx <= 10) {
    return "magenta";
  } else if (idx >= 10 && idx <= 15) {
    return "red";
  } else {
    return "orange";
  }
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const NUM_POINTS = 20;

interface Point {
  innerX: number;
  innerY: number;
  outerX: number;
  outerY: number;
}

function createPoints(): Point[] {
  const points = [];

  const angleStep = (Math.PI * 2) / NUM_POINTS;
  const innerRad = 30;
  const outerRad = 170;

  const middleX = screenWidth / 2;
  const middleY = screenHeight / 2;

  for (let i = 1; i <= NUM_POINTS; i++) {
    const theta = i * angleStep;

    const x = middleX + Math.cos(theta) * innerRad;
    const y = middleY + Math.sin(theta) * innerRad;

    const outerX = middleX + Math.cos(theta) * outerRad;
    const outerY = middleY + Math.sin(theta) * outerRad;

    points.push({
      innerX: x,
      innerY: y,
      outerX,
      outerY,
    });
  }

  return points;
}

interface Props {
  point: Point;
  idx: number;
  isForward: boolean;
}

const CirclePair = ({ point, idx, isForward }: Props) => {
  const xMidPoint = (point.innerX + point.outerX) / 2;
  const yMidPoint = (point.innerY + point.outerY) / 2;

  const rotationIndicator = useSharedValue(0);

  useEffect(() => {
    const delay = isForward ? (NUM_POINTS - idx) * 75 : idx * 75;
    const transitionValue = isForward ? 0 : Math.PI;

    rotationIndicator.value = withDelay(
      delay,
      withTiming(transitionValue, {
        duration: 300,
        easing: Easing.linear,
      })
    );
  }, [isForward]);

  const rotation = useDerivedValue(() => {
    const matrix = toMatrix3(
      processTransform3d([{ rotateZ: rotationIndicator.value }])
    );
    return Skia.Matrix(matrix);
  }, [rotationIndicator]);

  return (
    <Group key={idx} matrix={rotation} origin={vec(xMidPoint, yMidPoint)}>
      <Line
        p1={vec(point.innerX, point.innerY)}
        p2={vec(point.outerX, point.outerY)}
        color={"white"}
      />
      <Circle
        r={7}
        cx={point.innerX}
        cy={point.innerY}
        color={getInnerColor(idx)}
      />
      <Circle
        r={7}
        cx={point.outerX}
        cy={point.outerY}
        color={getOuterColor(idx)}
      />
    </Group>
  );
};

export const BendingCircle = () => {
  const innerPoints = createPoints();

  const [isForward, setIsForward] = useState(true);

  const restartAnimation = () => {
    setIsForward(!isForward);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Canvas style={styles.canvas}>
        {innerPoints.map((point, idx) => {
          return (
            <CirclePair
              key={idx}
              point={point}
              idx={idx}
              isForward={isForward}
            />
          );
        })}
      </Canvas>
      <TouchableOpacity onPress={restartAnimation} style={styles.button}>
        <Text style={styles.buttonText}>Animate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    backgroundColor: "black",
    width: screenWidth,
    height: screenHeight,
  },
  button: {
    position: "absolute",
    backgroundColor: "purple",
    height: 60,
    width: 150,
    bottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
