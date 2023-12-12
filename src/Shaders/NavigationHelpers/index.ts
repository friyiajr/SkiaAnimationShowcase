import { Screen } from "../../Utils/Screen";
import { MetaballShader } from "../MetaballShader";
import { RandomCircles } from "../RandomCircles";

export const AnimationScreenNames = {
  RANDOM_CIRCLE: "Random Circle Shader ❉",
  METABALL_SHADER: "Metaball Shader 🔮",
};

export const allScreens: Screen[] = [
  {
    name: AnimationScreenNames.RANDOM_CIRCLE,
    component: RandomCircles,
  },
  {
    name: AnimationScreenNames.METABALL_SHADER,
    component: MetaballShader,
  },
];
