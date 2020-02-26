#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cv2
import json
import paddle.fluid as fluid
import paddle
import numpy as np
print(paddle.__version__)

exe = fluid.Executor(fluid.CPUPlace())
# dataset = fluid.DatasetFactory().create_dataset()
# dataset.set_batch_size(64)
model_path = "infer_model/MobileNetV2/"
# model_path = "./model"
model_filename = "model"
params_filename = "params"
[prog, feed_target_names, fetch_targets] = fluid.io.load_inference_model(dirname=model_path, executor=exe, model_filename=model_filename, params_filename=params_filename)
# [prog, feed_target_names, fetch_targets] = fluid.io.load_inference_model(dirname=model_path, executor=exe)

data = np.random.rand(3,224,224)
data = data.reshape(1, 3, 224, 224)
data = data.astype("float32")

image = fluid.layers.data(name='image', shape=[3,224,224], dtype='float32')
feeder = fluid.DataFeeder(place=fluid.CPUPlace(), feed_list=[image])
out = exe.run(prog,fetch_list=fetch_targets,feed=feeder.feed([data]))
print(out[0].shape)
# cv2.imshow("image", image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# results = exe.run(prog, feed={feed_target_names[0]: image}, fetch_list=fetch_targets)[0].tolist()[0]
# for i in range(10):
#     if results[i] > 0.9:
#         print(i)

info = {"vars": [], "ops": []}

# 获取program中所有的变量
vs = list(prog.list_vars())
for v in vs:
    if not v.persistable:
        continue
    # found = False
    # for name in ["conv2d_0", "conv2d_1", "fc_0"]:
    #     if name in v.name:
    #         found = True
    #         break
    # if not found:
    #     continue

    # 匹配到"conv2d_0", "conv2d_1", "fc_0"
    p = fluid.Program()
    results = exe.run(p, fetch_list=[v])
    data = results[0]
    v_info = {}
    v_info["name"] = v.name
    v_info["shape"] = list(data.shape)
    v_info["data"] = data.flatten().tolist()
    info["vars"].append(v_info)

o = None
ops = prog.current_block().ops
for op in ops:
    # found = False
    # for type_name in ["feed", "fetch", "scale"]:
    #     if type_name in op.type:
    #         found = True
    #         break
    # if found:
    #     continue
    op_info = {}
    op_info["type"] = op.type
    inputs = {}
    for name in op.input_names:
        value = op.input(name)
        if len(value) <= 0:
            continue
        inputs[name] = value
    op_info["inputs"] = inputs
    outputs = {}
    for name in op.output_names:
        value = op.output(name)
        if len(value) <= 0:
            continue
        outputs[name] = value
    op_info["outputs"] = outputs
    info["ops"].append(op_info)
    if op.type == "conv2d":
        o = op
    attrs = {}
    for name in op.attr_names:
        if name in ["op_callstack", 'col', 'op_role', 'op_namescope', 'op_role_var']:
            continue
        value = op.attr(name)
        attrs[name] = value
    info["attrs"] = attrs

with open('model.json', 'w') as out_file:
    json.dump(info, out_file, indent=4, separators=(", ", ": "), sort_keys=True)


