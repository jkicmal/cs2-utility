export enum GameMap {
  Ancient = "de_ancient",
  Dust2 = "de_dust2",
  Inferno = "de_inferno",
  Mirage = "de_mirage",
  Nuke = "de_nuke",
  Overpass = "de_overpass",
  Train = "de_train",
}

export enum GameSide {
  T = "terrorists",
  CT = "counter-terrorists",
}

export enum Grenade {
  Grenade = "grenade",
  Smoke = "smoke",
  Molotov = "molotov",
  Flash = "flash",
}

export type Callout = {
  map: GameMap;
  side: GameSide;
  utility: Grenade;
  from: string;
  to: string;
  text: string;
};
