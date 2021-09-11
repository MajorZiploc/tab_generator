export type Notes = {
  string: number;
  fret?: number;
};

export type Tmap = {
  times?: number;
  notes: Notes[];
};

export type Tab = {
  tuning: string;
  tabMap: Tmap[];
};
