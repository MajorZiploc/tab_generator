// @ts-check

const fs = require('fs-extra');

/**
 * @typedef {import('./interfaces').Note} Note
 * @typedef {import('./interfaces').Tab} Tab
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
 * @type {(notes: Note[], numOfStrings: number, times: number) => Note[]}
 */
function notesToString(notes, numOfStrings, times) {
  const genList = (c) => [...Array(times)].map(_ => c);
  return notes.map(n => ({
    tabMarkers: n.fret === undefined ? genList('x') : genList((n.fret ?? '') + ''),
    ...n,
  }));
}

function chunk(inputArray, chunkSize) {
  const chunkedArray = [];
  for (let i = 0; i < inputArray.length; i += chunkSize) {
    chunkedArray.push(inputArray.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

/**
 * @type {() => Promise<void>}
 */
async function main() {
  // @ts-ignore
  const this_dir = __dirname;
  const tab = await fs.readJSON(`${this_dir}/../tabs/tab1.json`);
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
  const prepedPrintValues = Object.entries(gStringStrs)
    .sort((g1, g2) => (g1[0] < g2[0] ? -1 : 1))
    .map(o => ({ ...o, value: chunk(o[1].split(''), 40).map(c => c.join('')) }));
  console.log(JSON.stringify(prepedPrintValues, null, 2));

  const numOfChunks = prepedPrintValues?.find(p => p.value)?.value?.length;
  console.log(`Tuning: ${fullTab.tuning}`);
  [...Array(numOfChunks).keys()].forEach(chunkIndex => {
    console.log(`row: ${chunkIndex}`);
    prepedPrintValues?.forEach(gs => {
      console.log(gs.value[chunkIndex]);
    });
    console.log('');
  });
}

main();
