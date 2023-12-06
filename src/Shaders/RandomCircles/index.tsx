import React, { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import {
  Canvas,
  Rect,
  Shader,
  Skia,
  useClockValue,
  useComputedValue,
  vec,
} from "@shopify/react-native-skia";

import * as ScreenOrientation from "expo-screen-orientation";

export const RandomCircles = () => {
  const { width, height } = useWindowDimensions();

  const [isOrientationChanged, setIsOrientationChanged] = useState(false);

  const canvasWidth = width;
  const canvasHeight = height;

  useEffect(() => {
    (async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );

      setIsOrientationChanged(true);
    })();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const clock = useClockValue();

  const shader = Skia.RuntimeEffect.Make(`
    uniform vec2 u_aspectRatio;
    uniform float u_time;

    float sdCircle(vec2 uv, float r) {
      return length(vec2(uv.x, uv.y)) - r;
    }

    float opRep(vec2 p, float r, vec2 c, float dbl)
    {
      vec2 qx = mod(p+(0.5 + u_time * dbl * 5)*c,c)-0.5*c;
      vec2 qy = mod(p+0.5*c,c)-0.5*c;
      vec2 q = vec2(qx.x, qy.y);
      
      return sdCircle(q, r);
    }

    vec3 drawScene(vec2 uv) {
      vec3 col = vec3(0.);
      float alpha1 = 1;

      float res = opRep(uv, 0.05, vec2(0.1, 0.1), 1);

      if(res < -0.004) {
        alpha1 = 0;
      }

      res = step(0., res);
      col = mix(vec3(1,1,1) * alpha1, col, res);

      for(int i = 1; i <= 4; i++) {
        float yPos = float(i) / 10;
        res = opRep(uv, 0.05, vec2(0.1, yPos), 1);
        res = step(0., res);
        col = mix(col * 1.5 * sin(4 + u_time * float(i)), col, res);
      }

      vec3 original = col;

      for(int i = 1; i <= 4; i++) {
        float xPos = float(i) / 10;
        float offsetSpeed =  1 / float(i);
        res = opRep(uv, 0.05, vec2(xPos, 0.1), offsetSpeed);
        res = step(0., res);
        col = mix(original * 1.3 * sin(13 + u_time * float(i * 3)), col, res);
      }

      return col;
    }

    vec4 main(vec2 pos) {
      vec2 uv = pos / u_aspectRatio;
      uv -= 0.5; 
      uv.x *= u_aspectRatio.x/u_aspectRatio.y;
      vec3 col = drawScene(uv);
      return vec4(col, 1.0);
    }
  `)!;

  const uniforms = useComputedValue(() => {
    return {
      u_aspectRatio: vec(canvasWidth, canvasHeight),
      u_time: clock.current * 0.0001,
    };
  }, [clock, canvasWidth, canvasHeight]);

  const canvasStyle = {
    height: canvasHeight,
    width: canvasWidth,
  };

  if (!isOrientationChanged) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Canvas style={canvasStyle}>
        <Rect
          x={0}
          y={0}
          height={canvasHeight}
          width={canvasWidth}
          color={"white"}
        >
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
        {/* <Circle
          cx={canvasWidth / 2}
          cy={canvasHeight / 2}
          r={150}
          color={"white"}
        >
          <Shader source={shader} uniforms={uniforms} />
        </Circle> */}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
});
