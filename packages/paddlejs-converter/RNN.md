# RNN算子计算过程

## 一、RNN理解

RNN：循环神经网络，是由输入层、一个隐藏层和一个输出层组成：
![图片](https://pic4.zhimg.com/80/v2-3884f344d71e92d70ec3c44d2795141f_1440w.jpg)

U：输入层到隐藏层的权重矩阵
V：隐藏层到输出层的权重矩阵


paddle官网文档：https://www.paddlepaddle.org.cn/documentation/docs/zh/api/paddle/nn/RNN_cn.html#rnn

paddle源码实现：https://github.com/PaddlePaddle/Paddle/blob/develop/paddle/fluid/operators/rnn_op.h#L812


##二、RNN计算方式
![图片](http://bos.bj.bce-internal.sdns.baidu.com/agroup-bos-bj/bj-2e9e106bc9e13aaeb18e9ae10dd7a5cd3b57a6c4)
<center><font size=2>RNN时间线展开图</font></center>

$网络在  t  时刻接收到输入  X_t  之后，隐藏层的值是 S_t  ，输出值是  O_t 。关键一点是， S_t 的值不仅仅取决于  X_t ，还取决于  S_{t-1} $。可以用下面的公式来表示循环神经网络的计算方法：

![图片](http://bos.bj.bce-internal.sdns.baidu.com/agroup-bos-bj/bj-dc5982fcfcc1c78f1394e34c768337da70efe0ee)
<center><font size=2>RNN公式</font></center>

## 三、pdjs中RNN算子实现

### 以ch_ppocr_mobile_v2.0_rec_infer 模型 rnn算子为例：
```javascript
{
	Attr: {
		mode: 'LSTM'
		//  是否双向，为true则正向反向都需要遍历
		is_bidirec: true
		// 隐藏层层数，代表循环次数
		num_layers: 2
	}
	
	Input: [
		transpose_1.tmp_0[25, 1, 288]
	]

	PreState: [
		fill_constant_batch_size_like_0.tmp_0[4, 1, 48],  
		fill_constant_batch_size_like_1.tmp_0[4, 1, 48]
	]

	WeightList: [
		lstm_cell_0.w_0[192, 288], lstm_cell_0.w_1[192, 48], 
		lstm_cell_1.w_0[192, 288], lstm_cell_1.w_1[192, 48],
		lstm_cell_2.w_0[192, 96], lstm_cell_2.w_1[192, 48], 
		lstm_cell_3.w_0[192, 96], lstm_cell_3.w_1[192, 48],
		lstm_cell_0.b_0[192], lstm_cell_0.b_1[192],
		lstm_cell_1.b_0[192], lstm_cell_1.b_1[192],
		lstm_cell_2.b_0[192], lstm_cell_2.b_1[192], 
		lstm_cell_3.b_0[192], lstm_cell_3.b_1[192]
	]

	Output: [
	    lstm_0.tmp_0[25, 1, 96]
    ]
}
```

### 整体计算过程
![图片](http://bos.bj.bce-internal.sdns.baidu.com/agroup-bos-bj/bj-6cb50a05114867914a7f4fdff193e9590375e028)

### rnn 计算中新增op：
1）rnn_origin

计算公式： blas.MatMul(Input,  WeightList_ih, blas_ih) + blas.MatMul(PreState,  WeightList_hh,  blas_hh)

2）rnn_matmul

计算公式：rnn_matmul = rnn_origin +  Matmul( $ S_{t-1} $,  WeightList_hh)

3）rnn_cell

计算方式：将rnn_matmul op输出结果分割成4份，每份执行不同激活函数计算，最后输出lstm_x_y.tmp_c[1,  1,  48]。x∈[0, 3]，y∈[0, 24]。
详见算子实现：[rnn_cell](../paddlejs-backend-webgl/src/ops/shader/rnn/rnn_cell.ts)
)

4）rnn_hidden
计算方式：将rnn_matmul op输出结果分割成4份，每份执行不同激活函数计算，最后输出lstm_x_y.tmp_h[1,  1,  48]。x∈[0, 3]，y∈[0, 24]。
详见算子实现：[rnn_hidden](../paddlejs-backend-webgl/src/ops/shader/rnn/rnn_hidden.ts)


