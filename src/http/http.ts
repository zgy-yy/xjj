import axios, {type AxiosRequestConfig} from "axios";

axios.defaults.baseURL = 'api_service';
axios.defaults.timeout = 20 * 1000;
axios.defaults.maxBodyLength = 5 * 1024 * 1024;
axios.defaults.withCredentials = true


//请求拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig | any) => {
        config.params = {
            ...config.params,
            // t: Date.now()
        }
        config.responseType='blob'
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    (response) => {
        const data={
            url:response.request.responseURL,
            data: response.data
        }
        return {data};
    },
    function (error) {
        return Promise.reject(error);
    }
);

interface Http {
    get<T>(url: string, params?: unknown): Promise<T>;
}

const http: Http = {
    get<T>(url: string, params?: unknown): Promise<T> {
        return new Promise((resolve, reject) => {
            axios
                .get(url, {params})
                .then((res) => {  
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    }
}

export default http