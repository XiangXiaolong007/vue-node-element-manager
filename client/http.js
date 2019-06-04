import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from 'vue-router';

let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "拼命加载中...",
        background: 'rgba(0,0,0,0.7)'
    });
}

function endLoading() {
    loading.close();
}

// 请求拦截
axios.interceptors.request.use(config => {
    startLoading();
    if(localStorage.eleToken) {
        config.headers.Authorization = localStorage.eleToken;
    }
    return config;
}, err => {
    return Promise.reject(err)
})

// 响应拦截
axios.interceptors.response.use(res => {
    // 结束加载动画
    endLoading();
    return res;
}, err => {
    // 错误提醒
    endLoading();
    Message.error(err.response.data);
    // 获取错误状态码
    const { status } = err.response;
    if(status == 401) {
        Message.error("token失效，请重新登陆");
        // 清除token
        localStorage.removeItem("eleToken");
        router.push('/login')
    }
    return Promise.reject(err);
})

export default axios;