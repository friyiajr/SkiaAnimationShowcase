import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

// @ts-ignore
import { spline } from "@georgedoescode/spline";

import {
  Canvas,
  Circle,
  Path,
  SkiaMutableValue,
  useClockValue,
  useComputedValue,
  useValue,
} from "@shopify/react-native-skia";
import { createNoise2D } from "simplex-noise";

interface Coordinates {
  x: number;
  y: number;
  originX: number;
  originY: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
}

const random = (multiplier: number) => {
  return Math.random() * multiplier;
};

function createPoints(multiplier: number) {
  const points = [];
  // how many points do we need
  const numPoints = 6;
  // used to equally space each point around the circle
  const angleStep = (Math.PI * 2) / numPoints;
  // the radius of the circle
  const rad = 120;

  for (let i = 1; i <= numPoints; i++) {
    // x & y coordinates of the current point
    const theta = i * angleStep;

    const x = 150 + Math.cos(theta) * rad;
    const y = 150 + Math.sin(theta) * rad;

    // store the point
    points.push({
      x: x,
      y: y,
      /* we need to keep a reference to the point's original {x, y} coordinates
       for when we modulate the values later */
      originX: x,
      originY: y,
      // more on this in a moment!
      noiseOffsetX: random(multiplier),
      noiseOffsetY: random(multiplier),
    });
  }

  return points;
}

function map(
  n: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number
) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

export const MorphingLoader = () => {
  const clock = useClockValue();

  const points = useValue(createPoints(1200));
  const points2 = useValue(createPoints(1300));
  const points3 = useValue(createPoints(1400));
  const points4 = useValue(createPoints(1500));
  const points5 = useValue(createPoints(1600));

  const noise = createNoise2D();
  const noiseStep = 0.007;
  const blobSize = 28;
  const color = "#03C4A5";

  const animate = (
    oldPoints: SkiaMutableValue<Coordinates[]>,
    reverse: boolean
  ) => {
    const newPoints = [];

    for (let i = 0; i < oldPoints.current.length; i++) {
      const point = oldPoints.current[i];

      // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
      const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
      const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
      // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
      const x = map(
        nX,
        reverse ? 1 : -1,
        reverse ? -1 : 1,
        point.originX - blobSize,
        point.originX + blobSize
      );
      const y = map(
        nY,
        reverse ? 1 : -1,
        reverse ? -1 : 1,
        point.originY - blobSize,
        point.originY + blobSize
      );

      // update the point's current coordinates
      point.x = x;
      point.y = y;

      // progress the point's x, y values through "time"
      point.noiseOffsetX += noiseStep;
      point.noiseOffsetY += noiseStep;

      newPoints.push(point);
    }

    oldPoints.current = newPoints;
  };

  const path = useComputedValue(() => {
    animate(points, false);
    return spline(points.current, 1, true);
  }, [clock]);

  const path2 = useComputedValue(() => {
    animate(points2, true);
    return spline(points2.current, 1, true);
  }, [clock]);

  const path3 = useComputedValue(() => {
    animate(points3, false);
    return spline(points3.current, 1, true);
  }, [clock]);

  const path4 = useComputedValue(() => {
    animate(points4, true);
    return spline(points4.current, 1, true);
  }, [clock]);

  const path5 = useComputedValue(() => {
    animate(points5, false);
    return spline(points.current, 1, true);
  }, [clock]);

  return (
    <SafeAreaView style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path path={path} color={color} opacity={0.11} />
        <Path path={path2} color={color} opacity={0.11} />
        <Path path={path3} color={color} opacity={0.11} />
        <Path path={path4} color={color} opacity={0.11} />
        <Path path={path5} color={color} opacity={0.11} />
        <Circle cx={150} cy={150} r={70} color={"white"} />
      </Canvas>
      <Text style={{ fontSize: 30, marginTop: 10 }}>Loading...</Text>
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
    height: 300,
    width: 300,
  },
});
