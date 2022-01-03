// 云函数入口文件
const cloud = require('wx-server-sdk');
// 初始化环境
cloud.init();
const db = cloud.database();
const _ = db.command;
const wxContext = cloud.getWXContext();

// 云函数入口函数
exports.main = async event => {
    return Promise.race([
        getModelInfo(event.modelName),
        timeoutPromise()
    ])
        .then(res => {
            return {
                status: 0,
                msg: 'success',
                data: {
                    modelInfo: res && res.modelInfo
                }
            };
        })
        .catch(err => {
            return {
                status: err.errCode,
                msg: err.errMsg
            };
        });
};

// timeout
function timeoutPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(reject, 8000, {
            errCode: 10,
            errMsg: 'Request timed out'
        });
    });
}

function getModelInfo(modelName) {
    const modelInfo = db.collection('model_info').doc(modelName);
    return Promise.all([
        queryOpenId(wxContext.OPENID),
        modelInfo.get()
    ])
        .then(res => {
            if (res[0]) {
                // 内测用户
                return res[1] && res[1].data;
            }
            return res[1].data;
        });
}

function queryOpenId(currentId) {
    return db.collection('openid_list').where({
        openid: _.eq(currentId)
    })
        .get()
        .then(res => {
            return !!(res && res.data && res.data.length);
        });
}
