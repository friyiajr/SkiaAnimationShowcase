import GranTurismo from "../GranTurismo";
import { Screen } from "../../Utils/Screen";
import { MorphingLoader } from "../MorphingLoader";

export const AnimationScreenNames = {
  GRAN_TURISMO: "Gran Turismo Countdown 🏎",
  MORPHING_LOADER: "Morphing Loader 🍀",
};

export const allScreens: Screen[] = [
  {
    name: AnimationScreenNames.GRAN_TURISMO,
    component: GranTurismo,
  },
  {
    name: AnimationScreenNames.MORPHING_LOADER,
    component: MorphingLoader,
  },
];
