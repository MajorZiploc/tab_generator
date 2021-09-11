import * as tab from './tab1.json';
import { Tab, Note } from './models';
import { jsonRefactor as jr } from 'json-test-utility';

function fillInNotes(notes: Note[], numOfStrings: number) {
  // TODO: Assumes that the notes list doesnt have duplicate stringNum or string Nums outside of the num of strings
  let currentString = 1;
  while (numOfStrings >= currentString) {
    if (!notes.some(n => n.stringNum === currentString)) {
      // Add the missing string
      const note: Note = { stringNum: currentString };
      notes.push(note);
    }
    currentString++;
  }
  return notes;
}

function main(tab: Tab) {
  let fullTab = tab;
  const numOfStrings = tab.tuning.split('-').length;
  console.log(numOfStrings);
  // Set missing times to 1
  fullTab = {
    tabMap: tab.tabMap.map(t => ({ times: t.times ?? 1, notes: fillInNotes(t.notes, numOfStrings), ...t })),
    ...tab,
  };
  console.log(JSON.stringify(fullTab, null, 2));
}

main(tab);
