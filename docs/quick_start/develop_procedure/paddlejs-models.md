# 使用 paddlejs-models 进行模型部署

paddlejs-models 提供封装好的模型 sdk，集成 paddlejs-core 和 paddlejs-backend-x 库，是面向前端开发工程师的 AI 能力解决方案，目前已支持 mobilenetv2、humanseg、gesture 和 ocrdetection。

models sdk 提供了模型文件，无需开发者再额外引入模型，并且封装了前后处理，暴露简单的 api；sdk 里提供了 demo 和本地 server 服务，开发者可以执行 scripts 命令查看 demo 效果。


## humanseg
humanseg sdk 可以处理图片、视频实现人像分割，api 介绍和使用方案请参考 [@paddlejs-models/humanseg](https://github.com/PaddlePaddle/Paddle.js/tree/master/packages/paddlejs-models/humanseg)



## gesture
gesture sdk 是双模型 sdk，使用 gesture_detect 和 gesture_rec，可以识别手势，手势类型包括 布、剪刀、石头、1 和 ok，api 介绍和使用方案请参考 [@paddlejs-models/gesture](https://github.com/PaddlePaddle/Paddle.js/tree/master/packages/paddlejs-models/gesture)


## ocrdetection
ocrdetection sdk 可以检测图片里的文字，api 介绍和使用方案请参考 [@paddlejs-models/ocrdetection](https://github.com/PaddlePaddle/Paddle.js/tree/master/packages/paddlejs-models/ocrdetection)


## mobilenet
mobilenet sdk 实现对图片进行分类，详细 api 介绍和使用方案请参考 [@paddlejs-models/mobilenet](https://github.com/PaddlePaddle/Paddle.js/tree/master/packages/paddlejs-models/mobilenet)

