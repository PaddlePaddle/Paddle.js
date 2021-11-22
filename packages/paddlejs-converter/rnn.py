#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import math

def splice_rnn_op(model_info, rnn_index):

    global input_shape, weight_0_shape, weight_1_shape, rnn_input_name
    ops = model_info['ops']
    vars = model_info['vars']
    op = ops[rnn_index]

    rnn_input_name = op['inputs']['Input'][0]
    rnn_output_name = op['outputs']['Out'][0]

    is_bidirec = 2 if op['attrs']['is_bidirec'] else 1
    num_layers = op['attrs']['num_layers']
    hidden_size = op['attrs']['hidden_size']
    layer_num = num_layers * is_bidirec

    for index in range(layer_num):
        input_name = rnn_input_name
        last_hidden = op['inputs']['PreState'][0]
        last_cell = op['inputs']['PreState'][1]
        weight_list_0 = op['inputs']['WeightList'][index * 2]
        weight_list_1 = op['inputs']['WeightList'][index * 2 + 1]
        weight_list_2 = op['inputs']['WeightList'][(index + num_layers * is_bidirec) * 2]
        weight_list_3 = op['inputs']['WeightList'][(index + num_layers * is_bidirec) * 2 + 1]
        output_name = 'rnn_origin_' + str(index)

        input_shape = vars[input_name]['shape']

        batch = input_shape[0]

        if vars[weight_list_0]:
            weight_0_shape = vars[weight_list_0]['shape']

        if vars[weight_list_1]:
            weight_1_shape = vars[weight_list_1]['shape']

        if batch == 0:
            continue

        origin_op = {
            'attrs': {
                "state_axis": index
            },
            'inputs': {
                "Input": [input_name],
                "PreState": [last_hidden],
                "WeightList": [
                    weight_list_0,
                    weight_list_1,
                    weight_list_2,
                    weight_list_3
                ]
            },
            'outputs': {'Out': [output_name]},
            'type': 'rnn_origin'
        }

        origin_var = {
            'name': output_name,
            'persistable': False,
            'shape': [input_shape[0], input_shape[1], weight_0_shape[0]]
        }
        ops.append(origin_op)
        vars[output_name] = origin_var

        for bat in range(batch):
            matmul_output_name = 'lstm_' + str(index) + '_' + str(bat) + '.tmp_matmul'
            cell_output_name = 'lstm_' + str(index) + '_' + str(bat) + '.tmp_c'
            hidden_output_name = 'lstm_' + str(index) + '_' + str(bat) + '.tmp_h'

            matmul_op = {
                'attrs': {
                    "input_axis": bat,
                    "state_axis": index if bat == 0 else 0,
                    "batch": batch,
                    "reverse": False if index % 2 == 0 else True
                },
                'inputs': {
                    "Input": [output_name],
                    "PreState": [last_hidden],
                    "WeightList": [weight_list_1]
                },
                'outputs': {'Out': [matmul_output_name]},
                'type': 'rnn_matmul'
            }

            matmul_var = {
                'name': matmul_output_name,
                'persistable': False,
                'shape': [1, 1, weight_0_shape[0]]
            }

            ops.append(matmul_op)
            vars[matmul_output_name] = matmul_var

            cell_op = {
                'attrs': {
                    "state_axis": index if bat == 0 else 0,
                    "hidden_size": hidden_size
                },
                'inputs': {
                    "X": [matmul_output_name],
                    "Y": [last_cell]
                },
                'outputs': {'Out': [cell_output_name]},
                'type': 'rnn_cell'
            }

            cell_var = {
                'name': cell_output_name,
                'persistable': False,
                'shape': [1, 1, weight_1_shape[1]]
            }

            ops.append(cell_op)
            vars[cell_output_name] = cell_var

            hidden_op = {
                'attrs': {
                    "state_axis": index if bat == 0 else 0,
                    "hidden_size": hidden_size
                },
                'inputs': {
                    "X": [matmul_output_name],
                    "Y": [last_cell]
                },
                'outputs': {'Out': [hidden_output_name]},
                'type': 'rnn_hidden'
            }

            hidden_var = {
                'name': hidden_output_name,
                'persistable': False,
                'shape': [1, 1, weight_1_shape[1]]
            }

            ops.append(hidden_op)
            vars[hidden_output_name] = hidden_var

            last_hidden = hidden_output_name
            last_cell = cell_output_name

        # concat
        if index % 2 == 1:
            # concat forword and backword
            for bat in range(batch):
                x_input_name = 'lstm_' + str(index - 1) + '_' + str(bat) + '.tmp_h'
                y_input_name = 'lstm_' + str(index) + '_' + str(batch - bat - 1) + '.tmp_h'
                concat_output_name = 'lstm_' + str(index - 1) + '_' + str(bat) + '.tmp_concat'
                concat_op = {
                    'attrs': {
                        "axis": 2
                    },
                    'inputs': {
                        "X": [x_input_name],
                        "Y": [y_input_name]
                    },
                    'outputs': {'Out': [concat_output_name]},
                    'type': 'concat'
                }

                concat_var = {
                    'name': concat_output_name,
                    'persistable': False,
                    'shape': [1, 1, weight_1_shape[1] * 2]
                }
                ops.append(concat_op)
                vars[concat_output_name] = concat_var

            time = 1
            concat_num = batch
            concat_mul_num = 4
            splice_arr = []
            concat_sum = 0
            concat_input_num = 0

            # concat_mul 递归
            while math.floor(concat_num / concat_mul_num) > 0:
                concat_sum += concat_num
                concat_output_num = concat_sum
                concat_output_shape = int(math.pow(concat_mul_num, time))
                splice_num = int(concat_num % concat_mul_num)
                splice_arr_tmp = []

                for i in range(0, concat_num, 4):
                    if i + 4 > concat_num:
                        break

                    concat_output_name = 'lstm_' + str(index - 1) + '_' + str(concat_output_num) + '.tmp_concat'
                    concat_output_num += 1

                    x_input_name = 'lstm_' + str(index - 1) + '_' + str(concat_input_num + i) + '.tmp_concat'
                    y_input_name = 'lstm_' + str(index - 1) + '_' + str(concat_input_num + i + 1) + '.tmp_concat'
                    z_input_name = 'lstm_' + str(index - 1) + '_' + str(concat_input_num + i + 2) + '.tmp_concat'
                    m_input_name = 'lstm_' + str(index - 1) + '_' + str(concat_input_num + i + 3) + '.tmp_concat'

                    concat_op = {
                        'attrs': {
                            "axis": 0
                        },
                        'inputs': {
                            "X": [x_input_name],
                            "Y": [y_input_name],
                            "Z": [z_input_name],
                            "M": [m_input_name]
                        },
                        'outputs': {'Out': [concat_output_name]},
                        'type': 'concat_mul'
                    }

                    concat_var = {
                        'name': concat_output_name,
                        'persistable': False,
                        'shape': [concat_output_shape, 1, weight_1_shape[1] * 2]
                    }
                    ops.append(concat_op)
                    vars[concat_output_name] = concat_var

                # 保存没有用concat_mul合并的算子
                if splice_num > 0:

                    for num in range(splice_num, 0, -1):
                        add_num = concat_sum - num
                        splice_arr_tmp.append(add_num)

                splice_arr = splice_arr_tmp + splice_arr
                concat_input_num += concat_num
                concat_num = math.floor(concat_num / concat_mul_num)
                time += 1

            # 合并没有用concat_mul处理的算子
            while math.floor(len(splice_arr) / concat_mul_num) > 0:
                for i in range(0, len(splice_arr), 4):
                    if i + 4 > len(splice_arr):
                        break

                    concat_sum += 1
                    concat_output_name = 'lstm_' + str(index - 1) + '_' + str(concat_sum) + '.tmp_concat'

                    x_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[i]) + '.tmp_concat'
                    y_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[i + 1]) + '.tmp_concat'
                    z_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[i + 2]) + '.tmp_concat'
                    m_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[i + 3]) + '.tmp_concat'

                    concat_op = {
                        'attrs': {
                            "axis": 0
                        },
                        'inputs': {
                            "X": [x_input_name],
                            "Y": [y_input_name],
                            "Z": [z_input_name],
                            "M": [m_input_name]
                        },
                        'outputs': {'Out': [concat_output_name]},
                        'type': 'concat_mul'
                    }

                    concat_output_shape = \
                        vars[x_input_name]['shape'][0] \
                        + vars[y_input_name]['shape'][0] \
                        + vars[z_input_name]['shape'][0] \
                        + vars[m_input_name]['shape'][0]

                    concat_var = {
                        'name': concat_output_name,
                        'persistable': False,
                        'shape': [concat_output_shape, 1, weight_1_shape[1] * 2]
                    }
                    ops.append(concat_op)
                    vars[concat_output_name] = concat_var

                    del splice_arr[0: 4]

                    splice_arr.insert(0, concat_sum)

            if len(splice_arr):
                # 将合并后的最后算子插入 splice_arr 中
                splice_arr.insert(0, concat_input_num)
                splice_arr_len = len(splice_arr)
                concat_sum += 1
                concat_output_name = 'lstm_' + str(index - 1) + '_' + str(concat_sum) + '.tmp_concat'
                x_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[0]) + '.tmp_concat'
                y_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[1]) + '.tmp_concat'

                if index < is_bidirec * num_layers - 1:
                    rnn_input_name = concat_output_name

                else:
                    concat_output_name = rnn_output_name

                concat_op = {
                    'attrs': {
                        "axis": 0
                    },
                    'inputs': {
                        "X": [x_input_name],
                        "Y": [y_input_name]
                    },
                    'outputs': {'Out': [concat_output_name]},
                    'type': 'concat'
                }

                concat_output_shape = vars[x_input_name]['shape'][0] + vars[y_input_name]['shape'][0]

                if splice_arr_len > 2:
                    z_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[2]) + '.tmp_concat'
                    concat_op['inputs']['Z'] = [z_input_name]
                    concat_op['type'] = 'concat_mul'
                    concat_output_shape += vars[z_input_name]['shape'][0]

                    if splice_arr_len > 3:
                        m_input_name = 'lstm_' + str(index - 1) + '_' + str(splice_arr[3]) + '.tmp_concat'
                        concat_op['inputs']['M'] = [m_input_name]
                        concat_output_shape += vars[m_input_name]['shape'][0]

                concat_var = {
                    'name': concat_output_name,
                    'persistable': False,
                    'shape': [concat_output_shape, 1, weight_1_shape[1] * 2]
                }
                ops.append(concat_op)

                if index < is_bidirec * num_layers - 1:
                    vars[concat_output_name] = concat_var
                    splice_arr.insert(0, concat_sum)

    # 删除rnn op
    del ops[rnn_index]

