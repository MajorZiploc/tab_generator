export type Note = {
  stringNum: number;
  fret?: number;
};

export type Tmap = {
  times?: number;
  notes: Note[];
  notesString: string;
  spacer?: boolean;
};

export type Tab = {
  scale?: string;
  tuning: string;
  rowSize?: number;
  rowNotes?: string[];
  tabMap: Tmap[];
};

export type Mark = {
  tabMarkers: string[];
} & Note;
