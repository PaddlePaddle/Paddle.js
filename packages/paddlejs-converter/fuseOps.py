#!/usr/bin/env python
# -*- coding: UTF-8 -*-

def opListFuse(ops):
    """ 算子融合 """
    fuseOpList = [
        'relu',
        'relu6',
        'leaky_relu',
        'scale',
        'sigmoid',
        'hard_sigmoid',
        'pow',
        'sqrt',
        'tanh'
    ]

    # 判断op是否为单节点
    def opExistSingleNode(opName):
        name = opName
        if name:
            nodeNum = 0
            for i in range(len(ops)):
                op = ops[i]
                if 'X' not in op['inputs']:
                    continue

                inputName = op['inputs']['X']
                for x in inputName:
                    if x == name:
                        nodeNum = nodeNum + 1

            return True if nodeNum == 1 else False

        else:
            return False


    for index in reversed(range(len(ops))):
        if index > 0:
            for fuse in fuseOpList:
                op = ops[index]
                if op['type'] == fuse:
                    prevOp = ops[index - 1]

                    if opExistSingleNode(prevOp['outputs']['Out'][0]):
                        prevOp['attrs']['fuse_opt'] = {}
                        if 'fuse_opt' in op['attrs']:
                            prevOp['attrs']['fuse_opt'] = op['attrs']['fuse_opt']
                            del op['attrs']['fuse_opt']

                        prevOp['attrs']['fuse_opt'][fuse] = op['attrs']
                        prevOp['outputs']['Out'] = op['outputs']['Out']

                        del ops[index]
