import base64Img from 'base64-img';
import MediaProcessor from '../../src/mediaProcessor';
import '../../src/globals';

const path = require('path');
const { Image, createCanvas } = require('canvas');

const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');

const dir = path.dirname(module.filename);
const imgPath = path.resolve(dir, '../env/img/black.png');
const base64 = base64Img.base64Sync(imgPath);
const img = new Image();
img.src = base64;

describe('test mediaProcessor with scale and targetSize', () => {
    const mediaParams = {
        gapFillWith: '#000',
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225],
        feedShape: { fw: 224, fh: 224 },
        targetShape: [1, 3, 224, 224],
        targetSize: { height: 224, width: 224 },
        bgr: false
    };
    const processror = new MediaProcessor();
    processror.targetContext = ctx;
    processror.pixelWidth = 800;
    processror.pixelHeight = 600;

    const imageDataInfo = {
        dx: 0,
        dy: 0,
        dWidth: 224,
        dHeight: 224
    };


    test('test api allReshapeToRGB', () => {
        processror.fitToTargetSize(img, mediaParams);
        const imagedata = processror.getImageData(imageDataInfo);
        const data = processror.allReshapeToRGB(imagedata, mediaParams);
        expect(data.length).toBe(150528);
    });



    test('test api process', () => {
        const data = processror.process(img, mediaParams, { fw: 224, fh: 224 });
        expect(data).toEqual([{ data: [], shape: [1, 3, 224, 224], name: 'image', persistable: true }]);
    });
});

