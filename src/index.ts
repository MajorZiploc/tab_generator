import * as tab from './tab1.json';
import { Tab } from './models';
import { jsonRefactor as jr } from 'json-test-utility';

function main(tab: Tab) {
  let fullTab = tab;
  const numOfStrings = tab.tuning.split('-').length;
  console.log(numOfStrings);
  // Set missing times to 1
  fullTab = { tabMap: tab.tabMap.map(t => ({ times: t.times ?? 1, ...t })), ...tab };
  console.log(JSON.stringify(fullTab, null, 2));
}

main(tab);
