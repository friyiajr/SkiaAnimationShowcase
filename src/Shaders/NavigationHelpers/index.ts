import { Screen } from "../../Utils/Screen";
import { RandomCircles } from "../RandomCircles";
import { ShaderMenu } from "../ShaderMenu";

export const AnimationScreenNames = {
  RANDOM_CIRCLE: "Random Circle Shader ❉",
};

export const allScreens: Screen[] = [
  {
    name: AnimationScreenNames.RANDOM_CIRCLE,
    component: RandomCircles,
  },
];
