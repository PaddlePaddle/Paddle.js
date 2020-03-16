/* eslint-disable */
/**
 * @file 加法参数
 * @author yangmingming
 */
export default `
    // 输入数据
    const int axis = AXIS;
uniform float data_counter[TOTAL_SHAPE_COUNTER];
const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;
const int length_shape_origin = LENGTH_SHAPE_ORIGIN;
const int width_texture_origin = WIDTH_TEXTURE_ORIGIN;
const int height_texture_origin = HEIGHT_TEXTURE_ORIGIN;
const int channel_origin = CHANNEL_ORIGIN;
const int total_shape_origin = TOTAL_SHAPE_ORIGIN;

const int height_shape_counter = HEIGHT_SHAPE_COUNTER;
const int width_shape_counter = WIDTH_SHAPE_COUNTER;
const int channel_counter = CHANNEL_COUNTER;
const int total_counter = TOTAL_SHAPE_COUNTER;

const int shape_length_origin = SHAPE_LENGTH_ORIGIN;
const int shape_length_counter = SHAPE_LENGTH_COUNTER;

    uniform sampler2D texture_origin;

    float getValueFromCounter(int index) {
        for (int i = 0; i < TOTAL_SHAPE_COUNTER; i++) {
            if (i == index) {
                return data_counter[i];
            }
        }
        return 0.0;
    }

`;
