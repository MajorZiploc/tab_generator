export type Note = {
  string: number;
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
