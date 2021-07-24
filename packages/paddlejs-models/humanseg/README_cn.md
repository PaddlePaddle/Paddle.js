[English](./README.md)

# 人像分割

实时的人像分割模型。使用者可以用于背景替换。需要使用接口 getGrayValue 获取灰度值。
然后使用接口 drawHumanSeg 绘制分割出来的人像，实现背景替换；使用接口 blurBackground 实现背景虚化；也可以使用 drawMask 接口绘制背景，可以配置参数来获取全黑背景或者原图背景。

# 使用

```js

// 引入 humanseg sdk
import * as humanseg from '@paddlejs-models/humanseg';

// 默认下载 398x224 shape 的模型，默认执行预热
await humanseg.load();

// 指定下载更轻量模型, 该模型 shape 288x160，预测过程会更快，但会有少许精度损失
// await humanseg.load(true, true); 


// 获取分割后的像素 alpha 值，大小为 [2, 398, 224] 或者 [2, 288, 160]
const { data } = await humanseg.getGrayValue(img);

// 获取 background canvas
const back_canvas = document.getElementById('background') as HTMLCanvasElement;

// 背景替换， 使用 back_canvas 作为新背景实现背景替换
const canvas1 = document.getElementById('back') as HTMLCanvasElement;
humanseg.drawHumanSeg(data, canvas1, back_canvas) ;

// 背景虚化
const canvas2 = document.getElementById('blur') as HTMLCanvasElement;
humanseg.drawHumanSeg(data, canvas2) ;

// 绘制人型遮罩，在新背景上隐藏人像
const canvas3 = document.getElementById('mask') as HTMLCanvasElement;
humanseg.drawMask(data, back_canvas, canvas3);

```

# 效果

  从左到右：原图、背景虚化、背景替换、人型遮罩

  <img width="800"  src="https://user-images.githubusercontent.com/10822846/126873788-1e2d4984-274f-45be-8716-2a87ddda8c75.png"/>
  <img width="800"  src="https://user-images.githubusercontent.com/10822846/126873838-e5b68c9b-279f-4cb4-ae90-6aaaecd06aa4.png"/>


# 视频会议
  <p>
  <img width="400"  src="https://user-images.githubusercontent.com/10822846/126872499-c3fd680e-a01b-4daa-b0cb-acd3290862bd.gif"/>
  <img width="400"  src="https://user-images.githubusercontent.com/10822846/126872930-4f4c5c5d-5c51-44fe-b2d6-3f83c4e124bc.png"/>
  </p>