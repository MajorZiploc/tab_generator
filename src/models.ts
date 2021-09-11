export type Note = {
  stringNum: number;
  fret?: number;
};

export type Tmap = {
  times?: number;
  notes: Note[];
};

export type Tab = {
  tuning: string;
  tabMap: Tmap[];
};
