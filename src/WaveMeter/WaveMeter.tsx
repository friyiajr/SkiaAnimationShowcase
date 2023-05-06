import React from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  View,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
} from "react-native";

import {
  Skia,
  Canvas,
  Path,
  Vertices,
  vec,
  useComputedValue,
  useClockValue,
  useValue,
  useTouchHandler,
  LinearGradient,
  Text,
  useFont,
} from "@shopify/react-native-skia";

import { line, curveBasis } from "d3";

const dimens = Dimensions.get("screen");
const width = 150;
const frequency = 2;
const initialAmplitude = 10;
const verticalShiftConst = 100;
const height = 600;
const horizontalShift = (dimens.width - width) / 2;
const indicatorArray = Array.from({ length: 11 }, (_, i) => i);

export const WaveMeter = () => {
  const verticalShift = useValue(verticalShiftConst);
  const amplitude = useValue(initialAmplitude);
  const clock = useClockValue();
  const font = useFont(require("../../bruno.ttf"), 20);

  const touchHandler = useTouchHandler({
    onActive: ({ y }) => {
      if (y > verticalShiftConst) {
        verticalShift.current = Math.min(height, y);
        amplitude.current = Math.max(
          0,
          (height - verticalShift.current) * 0.025
        );
      }
    },
  });

  const createWavePath = (phase = 20) => {
    let points = Array.from({ length: width + horizontalShift }, (_, index) => {
      const angle =
        ((index - horizontalShift) / width) * (Math.PI * frequency) + phase;
      return [
        index,
        amplitude.current * Math.sin(angle) + verticalShift.current,
      ];
    });

    const shiftedPoints = points.slice(horizontalShift, 300) as [
      number,
      number
    ][];
    const lineGenerator = line().curve(curveBasis);
    const waveLine = lineGenerator(shiftedPoints);
    const bottomLine = `L${
      width + horizontalShift
    },${height} L${horizontalShift},${height}`;
    const extendedWavePath = `${waveLine} ${bottomLine} Z`;
    return extendedWavePath;
  };

  const animatedPath = useComputedValue(() => {
    const current = (clock.current / 225) % 225;
    const start = Skia.Path.MakeFromSVGString(createWavePath(current))!;
    const end = Skia.Path.MakeFromSVGString(createWavePath(Math.PI * current))!;
    return start.interpolate(end, 0.5)!;
  }, [clock, verticalShift]);

  const trianglePath = useComputedValue(() => {
    return [
      vec(horizontalShift * 2.6, verticalShift.current - 20),
      vec(horizontalShift * 2.6, verticalShift.current + 20),
      vec(horizontalShift * 2.3, verticalShift.current),
    ];
  }, [verticalShift]);

  const gradientStart = useComputedValue(() => {
    return vec(0, verticalShift.current);
  }, [verticalShift]);

  const gradientEnd = useComputedValue(() => {
    return vec(0, verticalShift.current + 150);
  }, [verticalShift]);

  const getLabelYValueOffset = (position: number) => {
    return verticalShiftConst + 50 * position;
  };

  const getYLabelValue = (position: number) => {
    return `${100 - position * 10}`;
  };

  const alertValue = () => {
    const adjustedShift =
      (verticalShiftConst - verticalShift.current) /
        (height - verticalShiftConst) +
      1;

    Alert.alert("VALUE", `Your value is: ${Math.round(adjustedShift * 100)}`);
  };

  if (!font) {
    return <View />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Canvas style={styles.canvas} onTouch={touchHandler}>
        {indicatorArray.map((val) => {
          return (
            <Text
              key={val.toString()}
              x={50}
              y={getLabelYValueOffset(val)}
              text={getYLabelValue(val)}
              font={font}
              color={"white"}
            />
          );
        })}
        <Path path={animatedPath} style="fill">
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={["orange", "red"]}
          />
        </Path>
        <Vertices vertices={trianglePath} color={"red"} />
      </Canvas>
      <TouchableOpacity style={styles.buttonContainer} onPress={alertValue}>
        <RNText style={styles.buttonText}>GET VALUE</RNText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  canvas: {
    flex: 1,
  },
  buttonContainer: {
    height: 60,
    borderRadius: 8,
    backgroundColor: "#FF5349",
    marginHorizontal: 50,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
