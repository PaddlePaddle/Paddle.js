import base64Img from 'base64-img';
import MediaProcessor from '../../src/mediaProcessor';

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
        scale: 256,
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

    test('test api resizeAndFitTargetSize', () => {
        const imagedata = processror.resizeAndFitTargetSize(img, mediaParams);
        expect(imagedata.width).toBe(224);
        expect(imagedata.data.slice(0, 4).join(',')).toEqual('0,0,0,255');
    });

    test('test api fitToTargetSize', () => {
        const res = processror.fitToTargetSize(img, mediaParams);
        expect(res.sw).toBe(224);
    });

    test('test api reSize', () => {
        const res = processror.reSize(img, mediaParams);
        expect(res.sw).toBe(256);
        expect(res.sh).toBe(256);
        processror.pixelWidth = 600;
        processror.pixelHeight = 800;
        const res1 = processror.reSize(img, mediaParams);
        expect(res1.sw).toBe(256);
        expect(res1.sh).toBe(256);
        processror.pixelWidth = 700;
        processror.pixelHeight = 700;
        const res2 = processror.reSize(img, mediaParams);
        expect(res2.sw).toBe(256);
        expect(res2.sh).toBe(256);
    });

    test('test api allReshapeToRGB', () => {
        const imagedata = processror.resizeAndFitTargetSize(img, mediaParams);
        const data = processror.allReshapeToRGB(imagedata, mediaParams);
        expect(data.length).toBe(150528);
    });

    test('test api grayscale', () => {
        const imagedata = processror.resizeAndFitTargetSize(img, mediaParams);
        const avg = (imagedata.data[0] + imagedata.data[1] + imagedata.data[2]) / 3;
        const data = processror.grayscale(imagedata);
        expect(data[0]).toBe(avg);
        expect(data[3]).toBe(255);
    });

    test('test api reshape', () => {
        const imagedata = {
            data: new Array(10 * 12 * 4).fill(0)
        };
        const data = processror.reshape(imagedata, {
            width: 5,
            height: 6,
            mean: [0.485, 0.456, 0.406],
            std: [0.229, 0.224, 0.225]
        }, {
            sw: 10,
            sh: 12
        });
        expect(data.length).toBe(90);
    });

    test('test api process', () => {
        const data = processror.process(img, mediaParams);
        expect(data).toEqual([{ data: [], shape: [1, 3, 224, 224], name: 'image' }]);
    });
});

