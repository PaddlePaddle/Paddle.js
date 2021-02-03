class Conv2dAttrs {
    Scale_in: i32 = 1;
    Scale_in_eltwise: i32 = 1;
    Scale_out: i32 = 1;
    Scale_weights: i32[] = [ 1 ];
    data_format: string = 'AnyLayout';
    dilations: i32[] = [ 1, 1 ];
    exhaustive_search: bool = false;
    force_fp32_output: bool = false;
    fuse_relu: bool = false;
    fuse_relu_before_depthwise_conv: bool = false;
    fuse_residual_connection: bool = false;
    groups: i32 = 128;
    is_test: bool = false;
    paddings: i32[] = [ 0, 0 ];
    strides: i32[] = [ 1, 1 ];
    use_cudnn: bool = true;
    use_mkldnn: bool = false;
    use_quantizer: bool = false;
    workspace_size_MB: i32 = 4096
}

export {
    Conv2dAttrs
};
