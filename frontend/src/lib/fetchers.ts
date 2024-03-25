import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
   // withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;


export const fetcherWithOptions = ({ url, method, body, headers }: { url: string, method:string, body: any, headers?: any}) => {

    // const env = process.env.NODE_ENV;
    // const token = Cookies.get('csrftoken');
    // const config =
    //     env === 'development'
    //         ? {
    //               headers: {
    //                   'X-CSRFToken': token,
    //               },
    //           }

    //         : {};

    const config = {
        headers: {
            ...headers,
        }
    };
    
    switch (method) {
        case 'OPTIONS': {
            return axiosInstance.options(url).then((res) => res.data);
        }
        case 'DELETE': {
            return axiosInstance.delete(url, { ...config }).then((res) => res.data);
        }
        case 'PUT': {
            return axiosInstance.put(url, JSON.stringify(body), { ...config }).then((res) => res.data);
        }
        case 'PATCH': {
            return axiosInstance.patch(url, JSON.stringify(body), { ...config }).then((res) => res.data);
        }
        case 'POST': {
            return axiosInstance.post(url, JSON.stringify(body), { ...config }).then((res) => res.data);
        }
        default:
            return axiosInstance.get(url).then((res) => res.data);
    }
};


export const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);