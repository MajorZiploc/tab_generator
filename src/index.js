// @ts-check

const fs = require('fs-extra');

/**
 * @typedef {import('./interfaces').Note} Note
 * @typedef {import('./interfaces').Tab} Tab
 * @typedef {import('./interfaces').Mark} Mark
 * @typedef {import('./interfaces').Tmap} Tmap
 */


/**
 * @type {(notes: Note[], numOfStrings: number) => Note[]}
 */
function fillInNotes(notes, numOfStrings) {
  // TODO: Assumes that the notes list doesnt have duplicate stringNum or string Nums outside of the num of strings
  let currentString = 1;
  while (numOfStrings >= currentString) {
    if (!notes.some(n => n.stringNum === currentString)) {
      // Add the missing string
      const note = { stringNum: currentString };
      notes.push(note);
    }
    currentString++;
  }
  return notes;
}

/**
 * @type {(times: number) => (c: any) => any[]}
 */
const genList = (times) => (c) => [...Array(times)].map(_ => c);

/**
 * @type {(notes: Note[], times: number) => Mark[]}
 */
function notesToString(notes, times) {
  const genListHelper = genList(times);
  return notes.map(n => ({
    tabMarkers: n.fret == null ? genListHelper('-') : genListHelper((n.fret ?? '') + ''),
    ...n,
  }));
}

/**
 * @type {(inputArray: any[], chunkSize: number) => any[][]}
 */
function chunk(inputArray, chunkSize) {
  const chunkedArray = [];
  for (let i = 0; i < inputArray.length; i += chunkSize) {
    chunkedArray.push(inputArray.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

/**
 * @type {(thing: any) => any}
 */
function toNumElseId(thing) {
  const n = Number(thing);
  if (Number.isNaN(n)) return thing;
  return n;
}

/** @type {(t: Tmap) => Note[]} */
const getNotesFromTMap = t => t.notesStructured ? t.notesStructured : (t.notes || '').split('').reverse().map((e, idx) => ({stringNum: idx+1, fret: toNumElseId(e)}));

/**
 * @type {() => Promise<void>}
 */
async function main() {
  // @ts-ignore
  const tabPath = process.argv[2];
  if (!tabPath) throw 'Must specify a tabPath';
  /** @type {Tab} */
  const tab = await fs.readJSON(tabPath);
  let fullTab = tab;
  const numOfStrings = tab.tuning.split('-').length;
  // console.log(numOfStrings);
  // Set missing times to 1
  fullTab = {
    ...fullTab,
    tabMap: fullTab.tabMap.map(t => ({ times: t.times ?? 1, ...t, notesStructured: fillInNotes(getNotesFromTMap(t), numOfStrings) })),
  };
  // console.log(JSON.stringify(fullTab, null, 2));
  const flattenedNotes = fullTab.tabMap.flatMap(t => notesToString(t.notesStructured, t.times ?? 1));
  const gStringStrs = [...Array(numOfStrings).keys()]
    .map(n => n + 1)
    .reduce((acc, currentString) => {
      const currentStringNotes = flattenedNotes.filter(n => n.stringNum === currentString);
      const tabMarkers = currentStringNotes.flatMap(sn => sn.tabMarkers);
      acc['' + currentString] = tabMarkers.join('-');
      return acc;
    }, {});
  const rowSize = tab.rowSize ?? 40;
  // console.log(JSON.stringify(gStringStrs, null, 2));
  const prepedPrintValues = Object.entries(gStringStrs)
    .sort((g1, g2) => (g1[0] < g2[0] ? -1 : 1))
    .map(o => ({ ...o, value: chunk(o[1].split(''), rowSize).map(c => c.join('')) }));
  // console.log(JSON.stringify(prepedPrintValues, null, 2));
  const numOfChunks = prepedPrintValues?.find(p => p.value)?.value?.length;
  const rowNotes = tab.rowNotes || [];
  console.log(`Tuning: ${fullTab.tuning}`);
  if (fullTab.scale) {
    console.log(`Scale: ${fullTab.scale}`);
  }
  console.log(genList(rowSize)('-').join(''));
  [...Array(numOfChunks).keys()].forEach(chunkIndex => {
    console.log(`row: ${chunkIndex}`);
    prepedPrintValues?.forEach(gs => {
      console.log(gs.value[chunkIndex]);
    });
    if (rowNotes.length > chunkIndex) {
      console.log(rowNotes[chunkIndex]);
    }
    console.log('');
  });
}

main();
