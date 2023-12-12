import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import {
  Canvas,
  Rect,
  Shader,
  Skia,
  useClockValue,
  useComputedValue,
  vec,
} from "@shopify/react-native-skia";

const { width, height } = Dimensions.get("screen");

const canvasWidth = width;
const canvasHeight = height;

export const MetaballShader = () => {
  const clock = useClockValue();

  const shader = Skia.RuntimeEffect.Make(`
    uniform vec2 u_aspectRatio;
    uniform float u_time;

    float sdCircle(vec2 uv, float r, vec2 offset) {
      float x = uv.x - offset.x;
      float y = uv.y - offset.y;
      return length(vec2(x, y)) - r;
    }

    float smin(float a, float b, float k) {
      float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
      return mix(b, a, h) - k*h*(1.0-h);
    }

    vec3 drawScene(vec2 uv) {
      vec3 col = vec3(0.);
      float d1 = sdCircle(uv, 0.07, vec2(cos(u_time * 5) / 7, 0.));
      float d2 = sdCircle(uv, 0.07, vec2(cos(u_time * 10) / 6, sin(u_time * 10) / 6));
      float d3 = sdCircle(uv, 0.07, vec2(0, sin(u_time * 11) / 7));
    
      float res; // result
      res = smin(d1, d2, 0.05);
      res = smin(res, d3, 0.05);
    
      // Solid
      res = step(0., res); // Same as res > 0. ? 1. : 0.;

      // Blurry
      // res = smoothstep(0., 0.03, res);
    
      col = mix(vec3(1,0,0), col, res);
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
  }, [clock]);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Rect
          x={0}
          y={0}
          height={canvasHeight}
          width={canvasWidth}
          color={"white"}
        >
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
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
  canvas: {
    height: canvasHeight,
    width: canvasWidth,
  },
});
