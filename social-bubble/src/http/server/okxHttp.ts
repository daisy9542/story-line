import type { AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

// 代理
let proxyAgent: HttpsProxyAgent<string> | undefined
if (process.env.HTTPS_PROXY_URL) {
  proxyAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY_URL)
}



const service = axios.create({
  baseURL: 'https://www.okx.com/priapi',
  timeout: 10 * 1000,
  headers: { 'Content-Type': 'application/json' },
  ...(proxyAgent && { 
    httpsAgent: proxyAgent,
    proxy: false
  })
})



// Handle Error
const handleError = (error: AxiosError): Promise<AxiosError> => {
  // console.log('handler Error ----', error)
  return Promise.reject(error.response?.data)
}

// Response interceptors configuration
service.interceptors.response.use((response: AxiosResponse) => {
  const data = response.data
  if (data.code === 0 || data.code === '0') { // okx的code是string类型
    return data
  } else {
    return Promise.reject(data)
  }
}, handleError)



class OkxHttp {
  get(url: string, params?: object) {
    return service.get(url, { params })
  }
  post(url: string, data?: object) {
    return service.post(url, data)
  }
}

export const okxHttp = new OkxHttp()



