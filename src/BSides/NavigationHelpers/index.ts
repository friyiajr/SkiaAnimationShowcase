import GranTurismo from "../GranTurismo";
import { Screen } from "../../Utils/Screen";

export const AnimationScreenNames = {
  GRAN_TURISMO: "Gran Turismo Countdown 🏎",
};

export const allScreens: Screen[] = [
  {
    name: AnimationScreenNames.GRAN_TURISMO,
    component: GranTurismo,
  },
];
