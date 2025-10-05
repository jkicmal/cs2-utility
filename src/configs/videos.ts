import { noCase } from "change-case";
import { GameMap, GameSide, Grenade, type Callout } from "../types/types";

export type UtilityVideo = {
  callout: Callout;
  fileName: string;
};

export const parseUtilityVideo = (fileName: string): UtilityVideo => {
  const re =
    /^(?<map>[^_]+_[^_]+)_(?<side>t|ct)_(?<utility>[^_]+)_from_(?<from>.+?)_to_(?<to>.+)$/i;

  const m = fileName.match(re);

  if (!m || !m.groups) {
    throw new Error(
      `Invalid format. Expected: <map>_<t|ct>_<utility>_from_<from>_to_<to>`
    );
  }

  const sideFull: GameSide =
    m.groups.side.toLowerCase() === "t" ? GameSide.T : GameSide.CT;

  const human = (s: string) => noCase(s).toLowerCase();

  const callout: Callout = {
    map: m.groups.map.toLowerCase() as GameMap,
    side: sideFull,
    utility: m.groups.utility.toLowerCase() as Grenade,
    from: m.groups.from.toLowerCase(),
    to: m.groups.to.toLowerCase(),
    text: "",
  };

  callout.text = [
    callout.utility,
    "from",
    human(callout.from),
    "to",
    human(callout.to),
  ].join(" ");

  return { fileName, callout };
};

export const formatCalloutButtonText = (input: Callout): string => {
  const { map, side, utility, from, to } = input;

  // "terrorists" -> "t", "counter-terrorists" -> "ct"
  const sideAbbrev = side === "terrorists" ? "t" : "ct";

  // helper to turn "b_window" -> "b window" and keep it lowercase
  const human = (s: string) => noCase(s).toLowerCase();

  // keep map id literal (e.g., "de_mirage") to match your example
  return `${map} - ${human(utility)} from ${sideAbbrev} ${human(
    from
  )} to ${human(to)}`;
};

export const utilityVideos: UtilityVideo[] = [
  parseUtilityVideo("de_mirage_t_smoke_from_apps_to_b_window"),
  parseUtilityVideo("de_mirage_t_smoke_from_apps_to_right_arch"),
  parseUtilityVideo("de_mirage_t_smoke_from_corner_to_connector"),
  parseUtilityVideo("de_mirage_t_smoke_from_ramp_to_ct"),
  parseUtilityVideo("de_mirage_t_smoke_from_ramp_to_jungle"),
  parseUtilityVideo("de_mirage_t_smoke_from_ramp_to_stairs"),
  parseUtilityVideo("de_mirage_t_smoke_from_spawn_to_connector"),
  parseUtilityVideo("de_mirage_t_smoke_from_spawn_to_window"),
];
