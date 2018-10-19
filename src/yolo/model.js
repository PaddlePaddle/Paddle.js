module.exports.program = {
  "blocks": [
    {
      "vars": {
        "conv1_biases": {
          "dim": [32],
          "persistable": true
        },
        "conv1_bn.tmp_0": {
          "dim": [32],
          "persistable": false
        },
        "conv1_bn.tmp_1": {
          "dim": [32],
          "persistable": false
        },
        "conv1_bn.tmp_2": {
          "dim": [-1, 32, 114, 114],
          "persistable": false
        },
        "conv1_bn_mean": {
          "dim": [32],
          "persistable": true
        },
        "conv1_bn_offset": {
          "dim": [32],
          "persistable": true
        },
        "conv1_bn_scale": {
          "dim": [32],
          "persistable": true
        },
        "conv1_bn_variance": {
          "dim": [32],
          "persistable": true
        },
        "conv1_weights": {
          "dim": [32, 3, 3, 3],
          "persistable": true
        },
        "conv2_1_dw_biases": {
          "dim": [32],
          "persistable": true
        },
        "conv2_1_dw_bn.tmp_0": {
          "dim": [32],
          "persistable": false
        },
        "conv2_1_dw_bn.tmp_1": {
          "dim": [32],
          "persistable": false
        },
        "conv2_1_dw_bn.tmp_2": {
          "dim": [-1, 32, 114, 114],
          "persistable": false
        },
        "conv2_1_dw_bn_mean": {
          "dim": [32],
          "persistable": true
        },
        "conv2_1_dw_bn_offset": {
          "dim": [32],
          "persistable": true
        },
        "conv2_1_dw_bn_scale": {
          "dim": [32],
          "persistable": true
        },
        "conv2_1_dw_bn_variance": {
          "dim": [32],
          "persistable": true
        },
        "conv2_1_dw_weights": {
          "dim": [32, 1, 3, 3],
          "persistable": true
        },
        "conv2_1_sep_biases": {
          "dim": [64],
          "persistable": true
        },
        "conv2_1_sep_bn.tmp_0": {
          "dim": [64],
          "persistable": false
        },
        "conv2_1_sep_bn.tmp_1": {
          "dim": [64],
          "persistable": false
        },
        "conv2_1_sep_bn.tmp_2": {
          "dim": [-1, 64, 114, 114],
          "persistable": false
        },
        "conv2_1_sep_bn_mean": {
          "dim": [64],
          "persistable": true
        },
        "conv2_1_sep_bn_offset": {
          "dim": [64],
          "persistable": true
        },
        "conv2_1_sep_bn_scale": {
          "dim": [64],
          "persistable": true
        },
        "conv2_1_sep_bn_variance": {
          "dim": [64],
          "persistable": true
        },
        "conv2_1_sep_weights": {
          "dim": [64, 32, 1, 1],
          "persistable": true
        },
        "conv2_2_dw_biases": {
          "dim": [64],
          "persistable": true
        },
        "conv2_2_dw_bn.tmp_0": {
          "dim": [64],
          "persistable": false
        },
        "conv2_2_dw_bn.tmp_1": {
          "dim": [64],
          "persistable": false
        },
        "conv2_2_dw_bn.tmp_2": {
          "dim": [-1, 64, 57, 57],
          "persistable": false
        },
        "conv2_2_dw_bn_mean": {
          "dim": [64],
          "persistable": true
        },
        "conv2_2_dw_bn_offset": {
          "dim": [64],
          "persistable": true
        },
        "conv2_2_dw_bn_scale": {
          "dim": [64],
          "persistable": true
        },
        "conv2_2_dw_bn_variance": {
          "dim": [64],
          "persistable": true
        },
        "conv2_2_dw_weights": {
          "dim": [64, 1, 3, 3],
          "persistable": true
        },
        "conv2_2_sep_biases": {
          "dim": [128],
          "persistable": true
        },
        "conv2_2_sep_bn.tmp_0": {
          "dim": [128],
          "persistable": false
        },
        "conv2_2_sep_bn.tmp_1": {
          "dim": [128],
          "persistable": false
        },
        "conv2_2_sep_bn.tmp_2": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2_2_sep_bn_mean": {
          "dim": [128],
          "persistable": true
        },
        "conv2_2_sep_bn_offset": {
          "dim": [128],
          "persistable": true
        },
        "conv2_2_sep_bn_scale": {
          "dim": [128],
          "persistable": true
        },
        "conv2_2_sep_bn_variance": {
          "dim": [128],
          "persistable": true
        },
        "conv2_2_sep_weights": {
          "dim": [128, 64, 1, 1],
          "persistable": true
        },
        "conv2d_0.tmp_0": {
          "dim": [-1, 32, 114, 114],
          "persistable": false
        },
        "conv2d_0.tmp_1": {
          "dim": [-1, 32, 114, 114],
          "persistable": false
        },
        "conv2d_1.tmp_0": {
          "dim": [-1, 32, 114, 114],
          "persistable": false
        },
        "conv2d_1.tmp_1": {
          "dim": [-1, 32, 114, 114],
          "persistable": false
        },
        "conv2d_10.tmp_0": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv2d_10.tmp_1": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv2d_11.tmp_0": {
          "dim": [-1, 256, 15, 15],
          "persistable": false
        },
        "conv2d_11.tmp_1": {
          "dim": [-1, 256, 15, 15],
          "persistable": false
        },
        "conv2d_12.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_12.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_13.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_13.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_14.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_14.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_15.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_15.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_16.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_16.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_17.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_17.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_18.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_18.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_19.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_19.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_2.tmp_0": {
          "dim": [-1, 64, 114, 114],
          "persistable": false
        },
        "conv2d_2.tmp_1": {
          "dim": [-1, 64, 114, 114],
          "persistable": false
        },
        "conv2d_20.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_20.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_21.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_21.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_22.tmp_0": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_22.tmp_1": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv2d_23.tmp_0": {
          "dim": [-1, 512, 8, 8],
          "persistable": false
        },
        "conv2d_23.tmp_1": {
          "dim": [-1, 512, 8, 8],
          "persistable": false
        },
        "conv2d_24.tmp_0": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_24.tmp_1": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_25.tmp_0": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_25.tmp_1": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_26.tmp_0": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_26.tmp_1": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_27.tmp_0": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_27.tmp_1": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv2d_28.tmp_0": {
          "dim": [-1, 505, 8, 8],
          "persistable": false
        },
        "conv2d_28.tmp_1": {
          "dim": [-1, 505, 8, 8],
          "persistable": false
        },
        "conv2d_3.tmp_0": {
          "dim": [-1, 64, 57, 57],
          "persistable": false
        },
        "conv2d_3.tmp_1": {
          "dim": [-1, 64, 57, 57],
          "persistable": false
        },
        "conv2d_4.tmp_0": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2d_4.tmp_1": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2d_5.tmp_0": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2d_5.tmp_1": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2d_6.tmp_0": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2d_6.tmp_1": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv2d_7.tmp_0": {
          "dim": [-1, 128, 29, 29],
          "persistable": false
        },
        "conv2d_7.tmp_1": {
          "dim": [-1, 128, 29, 29],
          "persistable": false
        },
        "conv2d_8.tmp_0": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv2d_8.tmp_1": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv2d_9.tmp_0": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv2d_9.tmp_1": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv3_1_dw_biases": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_dw_bn.tmp_0": {
          "dim": [128],
          "persistable": false
        },
        "conv3_1_dw_bn.tmp_1": {
          "dim": [128],
          "persistable": false
        },
        "conv3_1_dw_bn.tmp_2": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv3_1_dw_bn_mean": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_dw_bn_offset": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_dw_bn_scale": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_dw_bn_variance": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_dw_weights": {
          "dim": [128, 1, 3, 3],
          "persistable": true
        },
        "conv3_1_sep_biases": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_sep_bn.tmp_0": {
          "dim": [128],
          "persistable": false
        },
        "conv3_1_sep_bn.tmp_1": {
          "dim": [128],
          "persistable": false
        },
        "conv3_1_sep_bn.tmp_2": {
          "dim": [-1, 128, 57, 57],
          "persistable": false
        },
        "conv3_1_sep_bn_mean": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_sep_bn_offset": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_sep_bn_scale": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_sep_bn_variance": {
          "dim": [128],
          "persistable": true
        },
        "conv3_1_sep_weights": {
          "dim": [128, 128, 1, 1],
          "persistable": true
        },
        "conv3_2_dw_biases": {
          "dim": [128],
          "persistable": true
        },
        "conv3_2_dw_bn.tmp_0": {
          "dim": [128],
          "persistable": false
        },
        "conv3_2_dw_bn.tmp_1": {
          "dim": [128],
          "persistable": false
        },
        "conv3_2_dw_bn.tmp_2": {
          "dim": [-1, 128, 29, 29],
          "persistable": false
        },
        "conv3_2_dw_bn_mean": {
          "dim": [128],
          "persistable": true
        },
        "conv3_2_dw_bn_offset": {
          "dim": [128],
          "persistable": true
        },
        "conv3_2_dw_bn_scale": {
          "dim": [128],
          "persistable": true
        },
        "conv3_2_dw_bn_variance": {
          "dim": [128],
          "persistable": true
        },
        "conv3_2_dw_weights": {
          "dim": [128, 1, 3, 3],
          "persistable": true
        },
        "conv3_2_sep_biases": {
          "dim": [256],
          "persistable": true
        },
        "conv3_2_sep_bn.tmp_0": {
          "dim": [256],
          "persistable": false
        },
        "conv3_2_sep_bn.tmp_1": {
          "dim": [256],
          "persistable": false
        },
        "conv3_2_sep_bn.tmp_2": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv3_2_sep_bn_mean": {
          "dim": [256],
          "persistable": true
        },
        "conv3_2_sep_bn_offset": {
          "dim": [256],
          "persistable": true
        },
        "conv3_2_sep_bn_scale": {
          "dim": [256],
          "persistable": true
        },
        "conv3_2_sep_bn_variance": {
          "dim": [256],
          "persistable": true
        },
        "conv3_2_sep_weights": {
          "dim": [256, 128, 1, 1],
          "persistable": true
        },
        "conv4_1_dw_biases": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_dw_bn.tmp_0": {
          "dim": [256],
          "persistable": false
        },
        "conv4_1_dw_bn.tmp_1": {
          "dim": [256],
          "persistable": false
        },
        "conv4_1_dw_bn.tmp_2": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv4_1_dw_bn_mean": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_dw_bn_offset": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_dw_bn_scale": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_dw_bn_variance": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_dw_weights": {
          "dim": [256, 1, 3, 3],
          "persistable": true
        },
        "conv4_1_sep_biases": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_sep_bn.tmp_0": {
          "dim": [256],
          "persistable": false
        },
        "conv4_1_sep_bn.tmp_1": {
          "dim": [256],
          "persistable": false
        },
        "conv4_1_sep_bn.tmp_2": {
          "dim": [-1, 256, 29, 29],
          "persistable": false
        },
        "conv4_1_sep_bn_mean": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_sep_bn_offset": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_sep_bn_scale": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_sep_bn_variance": {
          "dim": [256],
          "persistable": true
        },
        "conv4_1_sep_weights": {
          "dim": [256, 256, 1, 1],
          "persistable": true
        },
        "conv4_2_dw_biases": {
          "dim": [256],
          "persistable": true
        },
        "conv4_2_dw_bn.tmp_0": {
          "dim": [256],
          "persistable": false
        },
        "conv4_2_dw_bn.tmp_1": {
          "dim": [256],
          "persistable": false
        },
        "conv4_2_dw_bn.tmp_2": {
          "dim": [-1, 256, 15, 15],
          "persistable": false
        },
        "conv4_2_dw_bn_mean": {
          "dim": [256],
          "persistable": true
        },
        "conv4_2_dw_bn_offset": {
          "dim": [256],
          "persistable": true
        },
        "conv4_2_dw_bn_scale": {
          "dim": [256],
          "persistable": true
        },
        "conv4_2_dw_bn_variance": {
          "dim": [256],
          "persistable": true
        },
        "conv4_2_dw_weights": {
          "dim": [256, 1, 3, 3],
          "persistable": true
        },
        "conv4_2_sep_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv4_2_sep_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv4_2_sep_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv4_2_sep_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv4_2_sep_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv4_2_sep_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv4_2_sep_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv4_2_sep_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv4_2_sep_weights": {
          "dim": [512, 256, 1, 1],
          "persistable": true
        },
        "conv5_1_dw_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_dw_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_1_dw_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_1_dw_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_1_dw_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_dw_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_dw_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_dw_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_dw_weights": {
          "dim": [512, 1, 3, 3],
          "persistable": true
        },
        "conv5_1_sep_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_sep_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_1_sep_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_1_sep_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_1_sep_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_sep_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_sep_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_sep_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_1_sep_weights": {
          "dim": [512, 512, 1, 1],
          "persistable": true
        },
        "conv5_2_dw_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_dw_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_2_dw_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_2_dw_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_2_dw_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_dw_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_dw_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_dw_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_dw_weights": {
          "dim": [512, 1, 3, 3],
          "persistable": true
        },
        "conv5_2_sep_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_sep_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_2_sep_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_2_sep_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_2_sep_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_sep_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_sep_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_sep_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_2_sep_weights": {
          "dim": [512, 512, 1, 1],
          "persistable": true
        },
        "conv5_3_dw_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_dw_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_3_dw_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_3_dw_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_3_dw_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_dw_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_dw_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_dw_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_dw_weights": {
          "dim": [512, 1, 3, 3],
          "persistable": true
        },
        "conv5_3_sep_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_sep_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_3_sep_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_3_sep_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_3_sep_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_sep_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_sep_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_sep_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_3_sep_weights": {
          "dim": [512, 512, 1, 1],
          "persistable": true
        },
        "conv5_4_dw_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_dw_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_4_dw_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_4_dw_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_4_dw_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_dw_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_dw_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_dw_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_dw_weights": {
          "dim": [512, 1, 3, 3],
          "persistable": true
        },
        "conv5_4_sep_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_sep_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_4_sep_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_4_sep_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_4_sep_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_sep_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_sep_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_sep_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_4_sep_weights": {
          "dim": [512, 512, 1, 1],
          "persistable": true
        },
        "conv5_5_dw_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_dw_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_5_dw_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_5_dw_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_5_dw_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_dw_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_dw_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_dw_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_dw_weights": {
          "dim": [512, 1, 3, 3],
          "persistable": true
        },
        "conv5_5_sep_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_sep_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_5_sep_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_5_sep_bn.tmp_2": {
          "dim": [-1, 512, 15, 15],
          "persistable": false
        },
        "conv5_5_sep_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_sep_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_sep_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_sep_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_5_sep_weights": {
          "dim": [512, 512, 1, 1],
          "persistable": true
        },
        "conv5_6_dw_biases": {
          "dim": [512],
          "persistable": true
        },
        "conv5_6_dw_bn.tmp_0": {
          "dim": [512],
          "persistable": false
        },
        "conv5_6_dw_bn.tmp_1": {
          "dim": [512],
          "persistable": false
        },
        "conv5_6_dw_bn.tmp_2": {
          "dim": [-1, 512, 8, 8],
          "persistable": false
        },
        "conv5_6_dw_bn_mean": {
          "dim": [512],
          "persistable": true
        },
        "conv5_6_dw_bn_offset": {
          "dim": [512],
          "persistable": true
        },
        "conv5_6_dw_bn_scale": {
          "dim": [512],
          "persistable": true
        },
        "conv5_6_dw_bn_variance": {
          "dim": [512],
          "persistable": true
        },
        "conv5_6_dw_weights": {
          "dim": [512, 1, 3, 3],
          "persistable": true
        },
        "conv5_6_sep_biases": {
          "dim": [1024],
          "persistable": true
        },
        "conv5_6_sep_bn.tmp_0": {
          "dim": [1024],
          "persistable": false
        },
        "conv5_6_sep_bn.tmp_1": {
          "dim": [1024],
          "persistable": false
        },
        "conv5_6_sep_bn.tmp_2": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv5_6_sep_bn_mean": {
          "dim": [1024],
          "persistable": true
        },
        "conv5_6_sep_bn_offset": {
          "dim": [1024],
          "persistable": true
        },
        "conv5_6_sep_bn_scale": {
          "dim": [1024],
          "persistable": true
        },
        "conv5_6_sep_bn_variance": {
          "dim": [1024],
          "persistable": true
        },
        "conv5_6_sep_weights": {
          "dim": [1024, 512, 1, 1],
          "persistable": true
        },
        "conv6_dw_biases": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_dw_bn.tmp_0": {
          "dim": [1024],
          "persistable": false
        },
        "conv6_dw_bn.tmp_1": {
          "dim": [1024],
          "persistable": false
        },
        "conv6_dw_bn.tmp_2": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv6_dw_bn_mean": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_dw_bn_offset": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_dw_bn_scale": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_dw_bn_variance": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_dw_weights": {
          "dim": [1024, 1, 3, 3],
          "persistable": true
        },
        "conv6_sep_biases": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_sep_bn.tmp_0": {
          "dim": [1024],
          "persistable": false
        },
        "conv6_sep_bn.tmp_1": {
          "dim": [1024],
          "persistable": false
        },
        "conv6_sep_bn.tmp_2": {
          "dim": [-1, 1024, 8, 8],
          "persistable": false
        },
        "conv6_sep_bn_mean": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_sep_bn_offset": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_sep_bn_scale": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_sep_bn_variance": {
          "dim": [1024],
          "persistable": true
        },
        "conv6_sep_weights": {
          "dim": [1024, 1024, 1, 1],
          "persistable": true
        },
        "conv7_dw_biases": {
          "dim": [1024],
          "persistable": true
        },
        "conv7_dw_weights": {
          "dim": [1024, 1, 3, 3],
          "persistable": true
        },
        "conv_pred_96_biases": {
          "dim": [505],
          "persistable": true
        },
        "conv_pred_96_weights": {
          "dim": [505, 1024, 1, 1],
          "persistable": true
        },
        "data_output": {
          "dim": [-1, 3, 227, 227],
          "persistable": false
        },
        "feed": {
          "dim": [],
          "persistable": true
        },
        "fetch": {
          "dim": [],
          "persistable": true
        },
      },
      "ops": [
        {
          "type": "feed",
          "inputs": {
            "X": ["feed"],
          },
          "outputs": {
            "Out": ["data_output"],
          },
          "attrs": {
            "col": 0,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv1_weights"],
            "Input": ["data_output"],
          },
          "outputs": {
            "Output": ["conv2d_0.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 1,
            "strides": [2, 2],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_0.tmp_0"],
            "Y": ["conv1_biases"],
          },
          "outputs": {
            "Out": ["conv2d_0.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv1_bn_offset"],
            "Mean": ["conv1_bn_mean"],
            "Scale": ["conv1_bn_scale"],
            "Variance": ["conv1_bn_variance"],
            "X": ["conv2d_0.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv1_bn_mean"],
            "SavedMean": ["conv1_bn.tmp_0"],
            "SavedVariance": ["conv1_bn.tmp_1"],
            "VarianceOut": ["conv1_bn_variance"],
            "Y": ["conv1_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv1_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv1_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv2_1_dw_weights"],
            "Input": ["conv1_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_1.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 32,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_1.tmp_0"],
            "Y": ["conv2_1_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_1.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv2_1_dw_bn_offset"],
            "Mean": ["conv2_1_dw_bn_mean"],
            "Scale": ["conv2_1_dw_bn_scale"],
            "Variance": ["conv2_1_dw_bn_variance"],
            "X": ["conv2d_1.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv2_1_dw_bn_mean"],
            "SavedMean": ["conv2_1_dw_bn.tmp_0"],
            "SavedVariance": ["conv2_1_dw_bn.tmp_1"],
            "VarianceOut": ["conv2_1_dw_bn_variance"],
            "Y": ["conv2_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv2_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv2_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv2_1_sep_weights"],
            "Input": ["conv2_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_2.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_2.tmp_0"],
            "Y": ["conv2_1_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_2.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv2_1_sep_bn_offset"],
            "Mean": ["conv2_1_sep_bn_mean"],
            "Scale": ["conv2_1_sep_bn_scale"],
            "Variance": ["conv2_1_sep_bn_variance"],
            "X": ["conv2d_2.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv2_1_sep_bn_mean"],
            "SavedMean": ["conv2_1_sep_bn.tmp_0"],
            "SavedVariance": ["conv2_1_sep_bn.tmp_1"],
            "VarianceOut": ["conv2_1_sep_bn_variance"],
            "Y": ["conv2_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv2_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv2_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv2_2_dw_weights"],
            "Input": ["conv2_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_3.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 64,
            "strides": [2, 2],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_3.tmp_0"],
            "Y": ["conv2_2_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_3.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv2_2_dw_bn_offset"],
            "Mean": ["conv2_2_dw_bn_mean"],
            "Scale": ["conv2_2_dw_bn_scale"],
            "Variance": ["conv2_2_dw_bn_variance"],
            "X": ["conv2d_3.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv2_2_dw_bn_mean"],
            "SavedMean": ["conv2_2_dw_bn.tmp_0"],
            "SavedVariance": ["conv2_2_dw_bn.tmp_1"],
            "VarianceOut": ["conv2_2_dw_bn_variance"],
            "Y": ["conv2_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv2_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv2_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv2_2_sep_weights"],
            "Input": ["conv2_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_4.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_4.tmp_0"],
            "Y": ["conv2_2_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_4.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv2_2_sep_bn_offset"],
            "Mean": ["conv2_2_sep_bn_mean"],
            "Scale": ["conv2_2_sep_bn_scale"],
            "Variance": ["conv2_2_sep_bn_variance"],
            "X": ["conv2d_4.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv2_2_sep_bn_mean"],
            "SavedMean": ["conv2_2_sep_bn.tmp_0"],
            "SavedVariance": ["conv2_2_sep_bn.tmp_1"],
            "VarianceOut": ["conv2_2_sep_bn_variance"],
            "Y": ["conv2_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv2_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv2_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv3_1_dw_weights"],
            "Input": ["conv2_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_5.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 128,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_5.tmp_0"],
            "Y": ["conv3_1_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_5.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv3_1_dw_bn_offset"],
            "Mean": ["conv3_1_dw_bn_mean"],
            "Scale": ["conv3_1_dw_bn_scale"],
            "Variance": ["conv3_1_dw_bn_variance"],
            "X": ["conv2d_5.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv3_1_dw_bn_mean"],
            "SavedMean": ["conv3_1_dw_bn.tmp_0"],
            "SavedVariance": ["conv3_1_dw_bn.tmp_1"],
            "VarianceOut": ["conv3_1_dw_bn_variance"],
            "Y": ["conv3_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv3_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv3_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv3_1_sep_weights"],
            "Input": ["conv3_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_6.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_6.tmp_0"],
            "Y": ["conv3_1_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_6.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv3_1_sep_bn_offset"],
            "Mean": ["conv3_1_sep_bn_mean"],
            "Scale": ["conv3_1_sep_bn_scale"],
            "Variance": ["conv3_1_sep_bn_variance"],
            "X": ["conv2d_6.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv3_1_sep_bn_mean"],
            "SavedMean": ["conv3_1_sep_bn.tmp_0"],
            "SavedVariance": ["conv3_1_sep_bn.tmp_1"],
            "VarianceOut": ["conv3_1_sep_bn_variance"],
            "Y": ["conv3_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv3_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv3_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv3_2_dw_weights"],
            "Input": ["conv3_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_7.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 128,
            "strides": [2, 2],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_7.tmp_0"],
            "Y": ["conv3_2_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_7.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv3_2_dw_bn_offset"],
            "Mean": ["conv3_2_dw_bn_mean"],
            "Scale": ["conv3_2_dw_bn_scale"],
            "Variance": ["conv3_2_dw_bn_variance"],
            "X": ["conv2d_7.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv3_2_dw_bn_mean"],
            "SavedMean": ["conv3_2_dw_bn.tmp_0"],
            "SavedVariance": ["conv3_2_dw_bn.tmp_1"],
            "VarianceOut": ["conv3_2_dw_bn_variance"],
            "Y": ["conv3_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv3_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv3_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv3_2_sep_weights"],
            "Input": ["conv3_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_8.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_8.tmp_0"],
            "Y": ["conv3_2_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_8.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv3_2_sep_bn_offset"],
            "Mean": ["conv3_2_sep_bn_mean"],
            "Scale": ["conv3_2_sep_bn_scale"],
            "Variance": ["conv3_2_sep_bn_variance"],
            "X": ["conv2d_8.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv3_2_sep_bn_mean"],
            "SavedMean": ["conv3_2_sep_bn.tmp_0"],
            "SavedVariance": ["conv3_2_sep_bn.tmp_1"],
            "VarianceOut": ["conv3_2_sep_bn_variance"],
            "Y": ["conv3_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv3_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv3_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv4_1_dw_weights"],
            "Input": ["conv3_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_9.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 256,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_9.tmp_0"],
            "Y": ["conv4_1_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_9.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv4_1_dw_bn_offset"],
            "Mean": ["conv4_1_dw_bn_mean"],
            "Scale": ["conv4_1_dw_bn_scale"],
            "Variance": ["conv4_1_dw_bn_variance"],
            "X": ["conv2d_9.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv4_1_dw_bn_mean"],
            "SavedMean": ["conv4_1_dw_bn.tmp_0"],
            "SavedVariance": ["conv4_1_dw_bn.tmp_1"],
            "VarianceOut": ["conv4_1_dw_bn_variance"],
            "Y": ["conv4_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv4_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv4_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv4_1_sep_weights"],
            "Input": ["conv4_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_10.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_10.tmp_0"],
            "Y": ["conv4_1_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_10.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv4_1_sep_bn_offset"],
            "Mean": ["conv4_1_sep_bn_mean"],
            "Scale": ["conv4_1_sep_bn_scale"],
            "Variance": ["conv4_1_sep_bn_variance"],
            "X": ["conv2d_10.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv4_1_sep_bn_mean"],
            "SavedMean": ["conv4_1_sep_bn.tmp_0"],
            "SavedVariance": ["conv4_1_sep_bn.tmp_1"],
            "VarianceOut": ["conv4_1_sep_bn_variance"],
            "Y": ["conv4_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv4_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv4_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv4_2_dw_weights"],
            "Input": ["conv4_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_11.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 256,
            "strides": [2, 2],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_11.tmp_0"],
            "Y": ["conv4_2_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_11.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv4_2_dw_bn_offset"],
            "Mean": ["conv4_2_dw_bn_mean"],
            "Scale": ["conv4_2_dw_bn_scale"],
            "Variance": ["conv4_2_dw_bn_variance"],
            "X": ["conv2d_11.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv4_2_dw_bn_mean"],
            "SavedMean": ["conv4_2_dw_bn.tmp_0"],
            "SavedVariance": ["conv4_2_dw_bn.tmp_1"],
            "VarianceOut": ["conv4_2_dw_bn_variance"],
            "Y": ["conv4_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv4_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv4_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv4_2_sep_weights"],
            "Input": ["conv4_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_12.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_12.tmp_0"],
            "Y": ["conv4_2_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_12.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv4_2_sep_bn_offset"],
            "Mean": ["conv4_2_sep_bn_mean"],
            "Scale": ["conv4_2_sep_bn_scale"],
            "Variance": ["conv4_2_sep_bn_variance"],
            "X": ["conv2d_12.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv4_2_sep_bn_mean"],
            "SavedMean": ["conv4_2_sep_bn.tmp_0"],
            "SavedVariance": ["conv4_2_sep_bn.tmp_1"],
            "VarianceOut": ["conv4_2_sep_bn_variance"],
            "Y": ["conv4_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv4_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv4_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_1_dw_weights"],
            "Input": ["conv4_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_13.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 512,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_13.tmp_0"],
            "Y": ["conv5_1_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_13.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_1_dw_bn_offset"],
            "Mean": ["conv5_1_dw_bn_mean"],
            "Scale": ["conv5_1_dw_bn_scale"],
            "Variance": ["conv5_1_dw_bn_variance"],
            "X": ["conv2d_13.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_1_dw_bn_mean"],
            "SavedMean": ["conv5_1_dw_bn.tmp_0"],
            "SavedVariance": ["conv5_1_dw_bn.tmp_1"],
            "VarianceOut": ["conv5_1_dw_bn_variance"],
            "Y": ["conv5_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_1_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_1_sep_weights"],
            "Input": ["conv5_1_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_14.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_14.tmp_0"],
            "Y": ["conv5_1_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_14.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_1_sep_bn_offset"],
            "Mean": ["conv5_1_sep_bn_mean"],
            "Scale": ["conv5_1_sep_bn_scale"],
            "Variance": ["conv5_1_sep_bn_variance"],
            "X": ["conv2d_14.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_1_sep_bn_mean"],
            "SavedMean": ["conv5_1_sep_bn.tmp_0"],
            "SavedVariance": ["conv5_1_sep_bn.tmp_1"],
            "VarianceOut": ["conv5_1_sep_bn_variance"],
            "Y": ["conv5_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_1_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_2_dw_weights"],
            "Input": ["conv5_1_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_15.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 512,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_15.tmp_0"],
            "Y": ["conv5_2_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_15.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_2_dw_bn_offset"],
            "Mean": ["conv5_2_dw_bn_mean"],
            "Scale": ["conv5_2_dw_bn_scale"],
            "Variance": ["conv5_2_dw_bn_variance"],
            "X": ["conv2d_15.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_2_dw_bn_mean"],
            "SavedMean": ["conv5_2_dw_bn.tmp_0"],
            "SavedVariance": ["conv5_2_dw_bn.tmp_1"],
            "VarianceOut": ["conv5_2_dw_bn_variance"],
            "Y": ["conv5_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_2_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_2_sep_weights"],
            "Input": ["conv5_2_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_16.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_16.tmp_0"],
            "Y": ["conv5_2_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_16.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_2_sep_bn_offset"],
            "Mean": ["conv5_2_sep_bn_mean"],
            "Scale": ["conv5_2_sep_bn_scale"],
            "Variance": ["conv5_2_sep_bn_variance"],
            "X": ["conv2d_16.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_2_sep_bn_mean"],
            "SavedMean": ["conv5_2_sep_bn.tmp_0"],
            "SavedVariance": ["conv5_2_sep_bn.tmp_1"],
            "VarianceOut": ["conv5_2_sep_bn_variance"],
            "Y": ["conv5_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_2_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_3_dw_weights"],
            "Input": ["conv5_2_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_17.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 512,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_17.tmp_0"],
            "Y": ["conv5_3_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_17.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_3_dw_bn_offset"],
            "Mean": ["conv5_3_dw_bn_mean"],
            "Scale": ["conv5_3_dw_bn_scale"],
            "Variance": ["conv5_3_dw_bn_variance"],
            "X": ["conv2d_17.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_3_dw_bn_mean"],
            "SavedMean": ["conv5_3_dw_bn.tmp_0"],
            "SavedVariance": ["conv5_3_dw_bn.tmp_1"],
            "VarianceOut": ["conv5_3_dw_bn_variance"],
            "Y": ["conv5_3_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_3_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_3_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_3_sep_weights"],
            "Input": ["conv5_3_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_18.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_18.tmp_0"],
            "Y": ["conv5_3_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_18.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_3_sep_bn_offset"],
            "Mean": ["conv5_3_sep_bn_mean"],
            "Scale": ["conv5_3_sep_bn_scale"],
            "Variance": ["conv5_3_sep_bn_variance"],
            "X": ["conv2d_18.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_3_sep_bn_mean"],
            "SavedMean": ["conv5_3_sep_bn.tmp_0"],
            "SavedVariance": ["conv5_3_sep_bn.tmp_1"],
            "VarianceOut": ["conv5_3_sep_bn_variance"],
            "Y": ["conv5_3_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_3_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_3_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_4_dw_weights"],
            "Input": ["conv5_3_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_19.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 512,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_19.tmp_0"],
            "Y": ["conv5_4_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_19.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_4_dw_bn_offset"],
            "Mean": ["conv5_4_dw_bn_mean"],
            "Scale": ["conv5_4_dw_bn_scale"],
            "Variance": ["conv5_4_dw_bn_variance"],
            "X": ["conv2d_19.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_4_dw_bn_mean"],
            "SavedMean": ["conv5_4_dw_bn.tmp_0"],
            "SavedVariance": ["conv5_4_dw_bn.tmp_1"],
            "VarianceOut": ["conv5_4_dw_bn_variance"],
            "Y": ["conv5_4_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_4_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_4_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_4_sep_weights"],
            "Input": ["conv5_4_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_20.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_20.tmp_0"],
            "Y": ["conv5_4_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_20.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_4_sep_bn_offset"],
            "Mean": ["conv5_4_sep_bn_mean"],
            "Scale": ["conv5_4_sep_bn_scale"],
            "Variance": ["conv5_4_sep_bn_variance"],
            "X": ["conv2d_20.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_4_sep_bn_mean"],
            "SavedMean": ["conv5_4_sep_bn.tmp_0"],
            "SavedVariance": ["conv5_4_sep_bn.tmp_1"],
            "VarianceOut": ["conv5_4_sep_bn_variance"],
            "Y": ["conv5_4_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_4_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_4_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_5_dw_weights"],
            "Input": ["conv5_4_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_21.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 512,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_21.tmp_0"],
            "Y": ["conv5_5_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_21.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_5_dw_bn_offset"],
            "Mean": ["conv5_5_dw_bn_mean"],
            "Scale": ["conv5_5_dw_bn_scale"],
            "Variance": ["conv5_5_dw_bn_variance"],
            "X": ["conv2d_21.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_5_dw_bn_mean"],
            "SavedMean": ["conv5_5_dw_bn.tmp_0"],
            "SavedVariance": ["conv5_5_dw_bn.tmp_1"],
            "VarianceOut": ["conv5_5_dw_bn_variance"],
            "Y": ["conv5_5_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_5_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_5_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_5_sep_weights"],
            "Input": ["conv5_5_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_22.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_22.tmp_0"],
            "Y": ["conv5_5_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_22.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_5_sep_bn_offset"],
            "Mean": ["conv5_5_sep_bn_mean"],
            "Scale": ["conv5_5_sep_bn_scale"],
            "Variance": ["conv5_5_sep_bn_variance"],
            "X": ["conv2d_22.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_5_sep_bn_mean"],
            "SavedMean": ["conv5_5_sep_bn.tmp_0"],
            "SavedVariance": ["conv5_5_sep_bn.tmp_1"],
            "VarianceOut": ["conv5_5_sep_bn_variance"],
            "Y": ["conv5_5_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_5_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_5_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_6_dw_weights"],
            "Input": ["conv5_5_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_23.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 512,
            "strides": [2, 2],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_23.tmp_0"],
            "Y": ["conv5_6_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_23.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_6_dw_bn_offset"],
            "Mean": ["conv5_6_dw_bn_mean"],
            "Scale": ["conv5_6_dw_bn_scale"],
            "Variance": ["conv5_6_dw_bn_variance"],
            "X": ["conv2d_23.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_6_dw_bn_mean"],
            "SavedMean": ["conv5_6_dw_bn.tmp_0"],
            "SavedVariance": ["conv5_6_dw_bn.tmp_1"],
            "VarianceOut": ["conv5_6_dw_bn_variance"],
            "Y": ["conv5_6_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_6_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_6_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv5_6_sep_weights"],
            "Input": ["conv5_6_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_24.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_24.tmp_0"],
            "Y": ["conv5_6_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_24.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv5_6_sep_bn_offset"],
            "Mean": ["conv5_6_sep_bn_mean"],
            "Scale": ["conv5_6_sep_bn_scale"],
            "Variance": ["conv5_6_sep_bn_variance"],
            "X": ["conv2d_24.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv5_6_sep_bn_mean"],
            "SavedMean": ["conv5_6_sep_bn.tmp_0"],
            "SavedVariance": ["conv5_6_sep_bn.tmp_1"],
            "VarianceOut": ["conv5_6_sep_bn_variance"],
            "Y": ["conv5_6_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv5_6_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv5_6_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv6_dw_weights"],
            "Input": ["conv5_6_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_25.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 1024,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_25.tmp_0"],
            "Y": ["conv6_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_25.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv6_dw_bn_offset"],
            "Mean": ["conv6_dw_bn_mean"],
            "Scale": ["conv6_dw_bn_scale"],
            "Variance": ["conv6_dw_bn_variance"],
            "X": ["conv2d_25.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv6_dw_bn_mean"],
            "SavedMean": ["conv6_dw_bn.tmp_0"],
            "SavedVariance": ["conv6_dw_bn.tmp_1"],
            "VarianceOut": ["conv6_dw_bn_variance"],
            "Y": ["conv6_dw_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv6_dw_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv6_dw_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv6_sep_weights"],
            "Input": ["conv6_dw_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_26.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_26.tmp_0"],
            "Y": ["conv6_sep_biases"],
          },
          "outputs": {
            "Out": ["conv2d_26.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "batch_norm",
          "inputs": {
            "Bias": ["conv6_sep_bn_offset"],
            "Mean": ["conv6_sep_bn_mean"],
            "Scale": ["conv6_sep_bn_scale"],
            "Variance": ["conv6_sep_bn_variance"],
            "X": ["conv2d_26.tmp_1"],
          },
          "outputs": {
            "MeanOut": ["conv6_sep_bn_mean"],
            "SavedMean": ["conv6_sep_bn.tmp_0"],
            "SavedVariance": ["conv6_sep_bn.tmp_1"],
            "VarianceOut": ["conv6_sep_bn_variance"],
            "Y": ["conv6_sep_bn.tmp_2"],
          },
          "attrs": {
            "momentum": 0.900000,
            "data_layout": "NCHW",
            "is_test": true,
            "epsilon": 0.000100,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv6_sep_bn.tmp_2"],
          },
          "outputs": {
            "Out": ["conv6_sep_bn.tmp_2"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv7_dw_weights"],
            "Input": ["conv6_sep_bn.tmp_2"],
          },
          "outputs": {
            "Output": ["conv2d_27.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [1, 1],
            "groups": 1024,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_27.tmp_0"],
            "Y": ["conv7_dw_biases"],
          },
          "outputs": {
            "Out": ["conv2d_27.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "relu",
          "inputs": {
            "X": ["conv2d_27.tmp_1"],
          },
          "outputs": {
            "Out": ["conv2d_27.tmp_1"],
          },
          "attrs": {
            "use_mkldnn": false,
          },
        },
        {
          "type": "conv2d",
          "inputs": {
            "Filter": ["conv_pred_96_weights"],
            "Input": ["conv2d_27.tmp_1"],
          },
          "outputs": {
            "Output": ["conv2d_28.tmp_0"],
          },
          "attrs": {
            "workspace_size_MB": 4096,
            "data_format": "AnyLayout",
            "use_mkldnn": false,
            "dilations": [1, 1],
            "use_cudnn": true,
            "paddings": [0, 0],
            "groups": 1,
            "strides": [1, 1],
          },
        },
        {
          "type": "elementwise_add",
          "inputs": {
            "X": ["conv2d_28.tmp_0"],
            "Y": ["conv_pred_96_biases"],
          },
          "outputs": {
            "Out": ["conv2d_28.tmp_1"],
          },
          "attrs": {
            "axis": 1,
          },
        },
        {
          "type": "fetch",
          "inputs": {
            "X": ["conv2d_28.tmp_1"],
          },
          "outputs": {
            "Out": ["fetch"],
          },
          "attrs": {
            "col": 0,
          },
        },
      ],
    },
  ]
}
