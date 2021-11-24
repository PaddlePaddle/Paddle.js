// import { reshape, genFeedData } from '../dist/index';
// import '../src/numjs.js';

// console.log((window as any).nj)

// const data = Array.from(new Array(3 * 224 * 224), () => 244);
// console.log(genFeedData(data, {targetShape: [1, 3, 224, 224], mean: [0.5, 0.5, 0.5]}));

// const nj = require('../src/numjs.js');
import { nj } from '../src/index';

const m = nj.array([1, 2, 3, 4, 5, 6], 'float32');
window.nj = nj;

console.log(m.flatten());