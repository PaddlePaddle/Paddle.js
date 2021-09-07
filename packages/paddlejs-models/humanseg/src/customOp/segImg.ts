/**
 * @file seg or blur origin image
 */

function mainFunc({
    out
}) {
    const THRESHHOLD = 0.4;
    return `

    #define SIGMA SIGMA 3.0
    #define BLUR_MSIZE 8
    #define MSIZE 3
    #define kernelSize 5.0
    #define weight 1.0

    uniform int type; // 0: blurBackground 1: drawHumanseg 2: drawMask

    void main() {
        vec2 outCoord = vCoord.xy;
       
        outCoord.y = 1.0 - vCoord.y;

        vec2 sourceTextureSize = vec2(${out.width_shape}, ${out.height_shape});
        vec2 sourceTexelSize = 1.0 / sourceTextureSize;

        float kernel[MSIZE]; // 5
        kernel[0] = 0.12579369017522166;
        kernel[1] = 0.13298;
        kernel[2] = 0.12579369017522166;


        float origin_alpha = TEXTURE2D(texture_origin, outCoord.xy / 2.0 + (0.5, 0.5)).r;
        vec4 counter = TEXTURE2D(texture_counter, outCoord.xy) / 255.0;
        vec4 res = vec4(0.0);

        if (type == 0) {
            // Simple Cheap Box Blur 
            float pixelSizeX = 1.0 / float(${out.width_shape});
            float pixelSizeY = 1.0 / float(${out.height_shape}); 
    
            // Horizontal Blur
            vec4 accumulation = vec4(0);
            float weightsum = 0.0;
            for (float i = -kernelSize; i <= kernelSize; i++){
                accumulation += TEXTURE2D(texture_counter, outCoord.xy + vec2(i * pixelSizeX, 0.0)) * weight;
                weightsum += weight;
            }
            // Vertical Blur
            for (float i = -kernelSize; i <= kernelSize; i++){
                accumulation += TEXTURE2D(texture_counter, outCoord.xy + vec2(0.0, i * pixelSizeY)) * weight;
                weightsum += weight;
            }
            
            res = accumulation / weightsum / 255.0;            
            // res = res / 255.0;
            if (origin_alpha > ${THRESHHOLD}) {
                res = counter;
            }
        }
        else if (type == 1) {
            vec4 pixel = vec4(1.0, 1.0, 1.0, 0.0);
            if (origin_alpha > ${THRESHHOLD}) {
                pixel.a = origin_alpha;
            }
            else {
                pixel = vec4(0.0, 0.0, 0.0, 0.0);
            }
            vec4 bc = pixel;
            vec4 gc = bc;

            float alpha = 0.0;
            float temp = 0.0;
            float gZ = 0.0;
            float gfactor;
            const int kSize = (MSIZE-1)/2; // 1

            //read out the texels
            for (int i=-kSize; i <= kSize; ++i) {
                for (int j=-kSize; j <= kSize; ++j) {
                    // color at pixel in the neighborhood
                    vec2 coord = outCoord.xy + vec2(float(i), float(j))*sourceTexelSize.xy;
                    float r = TEXTURE2D(texture_origin, coord.xy / 2.0 + (0.5, 0.5)).r;
                    temp = r > ${THRESHHOLD} ? r : 0.0;

                    // compute the gaussian smoothed
                    gfactor = kernel[kSize+j]*kernel[kSize+i];
                    gZ += gfactor;

                    alpha += gfactor*temp;
                }
            }

            gc = vec4(gc.rgb, alpha/gZ);

            if (alpha/gZ > 0.1) {
                gc = counter;
                gc.a = alpha/gZ;
            }
            res = gc;
            // res = vec4(gc.rgb * gc.a + counter.rgb * (1.0 - gc.a), 1.0);
        }
        else if (type == 2) {
            if (origin_alpha > ${THRESHHOLD}) {
                res = vec4(1.0);
                res.a = origin_alpha;
            }
        }
                
        setPackedOutput(res);
    }
    `;
}

export default {
    mainFunc,
    textureFuncConf: {
        origin: [],
        counter: []
    }
};
