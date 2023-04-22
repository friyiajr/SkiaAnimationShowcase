import {
  Canvas,
  Path,
  Skia,
  useClockValue,
  useComputedValue,
} from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";

export const VitalSignMonitor = () => {
  const path = Skia.Path.Make();
  path.moveTo(0, 80);
  path.lineTo(100, 80);
  path.lineTo(110, 50);
  path.lineTo(125, 155);
  path.lineTo(140, 0);
  path.lineTo(155, 100);
  path.lineTo(165, 80);
  path.lineTo(250, 80);

  const interval = 900;

  const clock = useClockValue();
  const forwardState = useComputedValue(() => {
    if (clock.current % (interval * 2) < interval) {
      return 1;
    }
    return (clock.current % interval) / interval;
  }, [clock]);

  const rewindState = useComputedValue(() => {
    if (clock.current % (interval * 2) < interval) {
      return (clock.current % interval) / interval;
    }
    return 0;
  }, [clock]);

  return (
    <Canvas style={styles.animationContainer}>
      <Path
        path={path}
        color="purple"
        style="stroke"
        strokeWidth={5}
        strokeCap="round"
        start={rewindState}
        end={forwardState}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    width: 250,
    height: 160,
    marginBottom: 30,
  },
});
