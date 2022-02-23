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

    for index in reversed(range(len(ops))):
        if index > 0:
            for fuse in fuseOpList:
                op = ops[index]
                if op['type'] == fuse:
                    prevOp = ops[index - 1]
                    prevOp['attrs']['fuse_opt'] = {}
                    if 'fuse_opt' in op['attrs']:
                        prevOp['attrs']['fuse_opt'] = op['attrs']['fuse_opt']
                        del op['attrs']['fuse_opt']

                    prevOp['attrs']['fuse_opt'][fuse] = op['attrs']
                    prevOp['outputs']['Out'] = op['outputs']['Out']
                    del ops[index]
