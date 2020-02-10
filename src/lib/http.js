import axios from 'axios';
import { ipUrl } from '../config/apiUrl'
import { getToken } from './auth'

// 新创建一个axios实例，并进行基础配置
const http = axios.create({
  baseURL: ipUrl,
  timeout: 2000,
});

http.interceptors.request.use((config) => {
  if (config.url.includes(ipUrl.login)) {
    return config
  }
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default http
