const opData = {
    name: 'conv2d',
    isPackedOp: false,
    input: {
        Input: [{
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ],
            name: 'image',
            shape: [1, 3, 3, 5],
            tensorName: 'origin'
        }],
        Filter: [{
            data: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
            name: 'conv2d_0.w_0',
            persistable: true,
            shape: [3, 2, 2],
            tensorName: 'filter'
        }]
    },
    output: {
        Output: [{
            name: 'conv2d_0.tmp_0',
            persistable: false,
            shape: [1, 1, 2, 4],
            tensorName: 'out'

        }]
    },
    attrs: {
        groups: 2,
        fuse_relu: false,
        paddings: [
            0,
            0
        ],
        strides: [
            1,
            1
        ]
    },
    data: {
        groups: 2,
        fuse_relu: false,
        paddings: [
            0,
            0
        ],
        strides: [
            1,
            1
        ],
        length_shape_bias: 4,
        length_shape_filter: 4,
        length_shape_origin: 4,
        limit_bias: '',
        limit_filter: '',
        limit_origin: ''
    },
    inputTensors: [
        {
            data: [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            exceedMax: false,
            isPacked: false,
            name: 'filter',
            shape: [1, 3, 2, 2],
            shape_packed: [],
            shape_texture: [4, 2, 6],
            shape_texture_packed: [],
            tensorId: 'conv2d_0.w_0',
            total: 12,
            binding: 1
        },
        {
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ],
            exceedMax: false,
            isPacked: false,
            name: 'origin',
            packedData: [],
            shape: [1, 3, 3, 5],
            shape_packed: [],
            shape_texture: [4, 3, 15],
            shape_texture_packed: [],
            tensorId: 'image',
            total: 45,
            binding: 2
        },
        {
            data: [0],
            exceedMax: false,
            isPacked: false,
            name: 'bias',
            packedData: [0],
            shape: [1, 1, 1, 1],
            shape_packed: [],
            shape_texture: [4, 1, 1],
            shape_texture_packed: [],
            tensorId: 'conv1_scale_offset_custom',
            total: 1,
            binding: 3
        }
    ],
    outputTensors: [{
        data: null,
        exceedMax: false,
        isPacked: false,
        name: 'out',
        packedData: [],
        shape: [1, 1, 2, 4],
        shape_packed: [],
        shape_texture: [4, 2, 4],
        shape_texture_packed: [],
        tensorId: 'conv2d_0.tmp_0',
        total: 8,
        binding: 0
    }],
    fShaderParams: [{
        groups: 2,
        paddings: [
            0,
            0
        ],
        strides: [
            1,
            1
        ]
    }],
    vars: [{
        name: 'conv2d_0.tmp_0',
        persistable: false,
        shape: [1, 1, 2, 4],
        tensorName: 'out'
    }, {
        data: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
        name: 'conv2d_0.w_0',
        persistable: true,
        shape: [3, 2, 2],
        tensorName: 'filter'
    }],
    iLayer: 1,
    program: [''],
    renderData: []
};

const opVar = {
    data: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    name: 'conv2d_0.w_0',
    persistable: true,
    shape: [3, 2, 2],
    tensorName: 'filter'
};

export default {
    opData,
    opVar
};
