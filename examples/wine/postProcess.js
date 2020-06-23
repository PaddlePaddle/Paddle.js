// index.js
import Map from '../../test/data/wine.map.json';
import Utils from '../../src/utils/utils';

export default function postProcess(data) {
    let maxItem = Utils.getMaxItem(data);
    return Map[maxItem.index];
}
