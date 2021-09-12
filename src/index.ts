import * as tab from './tab1.json';
import { Tab, Note } from './models';
import { jsonRefactor as jr } from 'json-test-utility';
import _ from 'lodash';

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

function notesToString(notes: Note[], numOfStrings: number, times: number) {
  const genList = (c: string) => [...Array(times)].map(n => c);
  return notes.map(n => ({
    tabMarkers: n.fret === undefined ? genList('x') : genList((n.fret ?? '') + ''),
    ...n,
  }));
}

function main(tab: Tab) {
  let fullTab = tab;
  const numOfStrings = tab.tuning.split('-').length;
  console.log(numOfStrings);
  // Set missing times to 1
  fullTab = {
    ...fullTab,
    tabMap: fullTab.tabMap.map(t => ({ times: t.times ?? 1, notes: fillInNotes(t.notes, numOfStrings), ...t })),
  };
  // console.log(JSON.stringify(fullTab, null, 2));
  const flattenedNotes = fullTab.tabMap.flatMap(t => notesToString(t.notes, numOfStrings, t.times ?? 1));
  const gStringStrs = [...Array(numOfStrings).keys()]
    .map(n => n + 1)
    .reduce((acc, currentString) => {
      const currentStringNotes = flattenedNotes.filter(n => n.stringNum === currentString);
      const tabMarkers = currentStringNotes.flatMap(sn => sn.tabMarkers);
      acc['' + currentString] = tabMarkers.join('-');
      return acc;
    }, {});
  console.log(JSON.stringify(gStringStrs, null, 2));
  const prepedPrintValues = jr
    .toKeyValArray(gStringStrs)
    .sort((g1, g2) => (g1.key < g2.key ? -1 : 1))
    .map(o => ({ ...o, value: _.chunk(o.value.split(''), 40).map(c => c.join('')) }));
  console.log(JSON.stringify(prepedPrintValues, null, 2));

  const numOfChunks = prepedPrintValues.find(p => p.value).value.length;
  console.log(`Tuning: ${fullTab.tuning}`);
  [...Array(numOfChunks).keys()].forEach(chunkIndex => {
    console.log(chunkIndex);
    prepedPrintValues.forEach(gs => {
      console.log(gs.value[chunkIndex]);
    });
    console.log('');
  });
}

main(tab);
