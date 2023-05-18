import React, { FC } from "react";

import {
  Canvas,
  DashPathEffect,
  Group,
  LinearGradient,
  Path,
  SkFont,
  Skia,
  SkiaMutableValue,
  Text,
  useComputedValue,
  vec,
} from "@shopify/react-native-skia";
import { View } from "react-native";

interface CircularProgressProps {
  strokeWidth: number;
  radius: number;
  backgroundColor: string;
  percentageComplete: SkiaMutableValue<number>;
  font: SkFont;
  targetPercentage: number;
  isIterationComplete: SkiaMutableValue<boolean>;
  iteration: SkiaMutableValue<number>;
  startFont: SkFont;
}

export const GranTurismoCountdown: FC<CircularProgressProps> = ({
  strokeWidth,
  radius,
  percentageComplete,
  font,
  isIterationComplete,
  iteration,
  startFont,
}) => {
  const innerRadius = radius - strokeWidth / 2;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const animationStart = useComputedValue(() => {
    return isIterationComplete.current ? 0 : percentageComplete.current;
  }, [isIterationComplete, percentageComplete]);

  const animationEnd = useComputedValue(() => {
    return isIterationComplete.current ? 0.995 - percentageComplete.current : 1;
  }, [isIterationComplete, percentageComplete]);

  const countdownNumber = useComputedValue(() => {
    return `${iteration.current}`;
  }, [percentageComplete, isIterationComplete]);

  const xPosition = useComputedValue(() => {
    const width = font.getTextWidth(`${iteration.current}`);
    return radius - width / 2;
  }, [percentageComplete, isIterationComplete]);

  const startOpacity = useComputedValue(() => {
    return iteration.current === 0 ? 0 : 1;
  }, [iteration]);

  const endOpacity = useComputedValue(() => {
    return iteration.current === 0 ? 1 : 0;
  }, [iteration]);

  const startFontSize = font.getTextWidth("START");

  return (
    <View style={{ height: radius * 2, width: radius * 2 }}>
      <Canvas style={{ height: radius * 2, width: radius * 2 }}>
        <Group
          origin={vec(radius, radius)}
          transform={[{ rotate: Math.PI * 1.5 }]}
          opacity={startOpacity}
        >
          <Path path={path} color="lightgrey" style="stroke" strokeWidth={6}>
            <DashPathEffect intervals={[1, 20]} />
          </Path>
          <Path
            path={path}
            color="white"
            style="stroke"
            strokeJoin="round"
            strokeWidth={strokeWidth}
            strokeCap="square"
            start={animationStart}
            end={animationEnd}
          >
            <LinearGradient
              start={vec(0, radius)}
              end={vec(radius * 2, radius)}
              colors={["orange", "red"]}
            />
          </Path>
        </Group>
        <Text
          x={xPosition}
          y={radius + strokeWidth + 30}
          text={countdownNumber}
          font={font}
          color="white"
          opacity={startOpacity}
        >
          <LinearGradient
            start={vec(0, radius)}
            end={vec(radius * 2, radius)}
            colors={["yellow", "red"]}
          />
        </Text>
        <Text
          x={startFontSize / 2 - radius - 75}
          y={radius + strokeWidth + 15}
          text={"START"}
          font={startFont}
          color="white"
          opacity={endOpacity}
        >
          <LinearGradient
            start={vec(0, radius)}
            end={vec(radius * 2, radius)}
            colors={["orange", "red"]}
          />
        </Text>
      </Canvas>
    </View>
  );
};
