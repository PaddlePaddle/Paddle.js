# PaddleJsModelCheck

Check if there are unsupported operators in the model
Check if there are tensors which shape are exceed the MAX_TEXTURE_SIZE

## Installation

System Requirements:

* paddlepaddle >= 2.0.0
* Python3： 3.5.1+ / 3.6 / 3.7
* Python2： 2.7.15+

#### Install PaddleJsModelCheck

```shell
pip3 install paddlejsmodelcheck

# or

pip install paddlejsmodelcheck
```


## Usage

```shell
# model and params file should be put in a same directory
paddlejsmodelcheck --modelPath=user_model_path --paramPath=user_model_params_path

# or

# source code
python3 check.py --modelPath=user_model_path --paramPath=user_model_params_path
```
