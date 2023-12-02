import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import {
  Blur,
  Canvas,
  Rect,
  SkFont,
  Text,
  useFont,
  Skia,
  Shader,
  useComputedValue,
  vec,
  useClockValue,
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

export const FocusAnimation = () => {
  const clock = useClockValue();

  const shader = Skia.RuntimeEffect.Make(`
    uniform vec2 u_aspectRatio;
    uniform float u_time;

    uniform float u_width;
    uniform float u_height;

    uniform vec2 c;
    uniform float r;

    vec3 getBackgroundColor(vec2 uv) {
      uv += 0.5; // remap uv from <-0.5,0.5> to <0,1>
      vec3 gradientStartColor = vec3(1., 0., 1.);
      vec3 gradientEndColor = vec3(0., 1., 1.);
      return mix(gradientStartColor, gradientEndColor, uv.y); // gradient goes from bottom to top
    }

    float udSegment( vec2 p, vec2 a, vec2 b )
    {
        vec2 ba = b-a;
        vec2 pa = p-a;
        float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
        return length(pa-h*ba);
    }

    float sdSegment( in vec2 p, in vec2 a, in vec2 b ) {
        vec2 pa = p-a, ba = b-a;
        float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
        return length( pa - ba*h );
    }

    float sdfCircle(vec2 uv, float r, vec2 offset) {
      float x = uv.x - offset.x;
      float y = uv.y - offset.y;
      
      return length(vec2(x, y)) - r;  
    }

    float sdfSquare(vec2 uv, float size, vec2 offset) {
      float x = uv.x - offset.x;
      float y = uv.y - offset.y;

      return max(abs(x), abs(y)) - size;
    }

    vec3 drawScene(vec2 uv, vec2 pos) {
      vec3 col = vec3(1);

      float segment = sdSegment( uv, vec2(0.4), vec2(-0.4) );
      float circle = sdfCircle(uv, 0.1, vec2(0, 0));
      float circle2 = sdfCircle(uv, 0.1, vec2(0.05, -0.1));
      float square = sdfSquare(uv, 0.07, vec2(0.1, 0));
      
      col = mix(vec3(0, 0, 0), col, step(0.01, segment));
      col = mix(vec3(0, 0, 1), col, step(0., circle));
      col = mix(vec3(0, 1, 0), col, step(0., circle2));
      col = mix(vec3(1, 0, 0), col, step(0., square));
      
      return col;
    }

    vec4 main(vec2 pos) {
      vec2 uv = pos / u_aspectRatio;
      uv -= 0.5;
      uv.y *= u_height/u_width;

      vec3 col = drawScene(uv, pos);

      return vec4(col,1.0);
    }
  `)!;

  const uniforms = useComputedValue(() => {
    return {
      u_aspectRatio: vec(width, height),
      u_time: clock.current * 0.0001,
      u_width: width,
      u_height: height,
      r: 10,
      c: vec(width / 2, height / 2),
    };
  }, [clock]);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} height={height} width={width} color={"white"}>
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
      </Canvas>
    </View>
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
});
