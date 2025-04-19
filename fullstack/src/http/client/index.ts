import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'

// Create axios instance
const service = axios.create({
  baseURL: '/api',
  timeout: 15 * 1000,
  headers: { 'Content-Type': 'application/json' }
})

// Handle Error
const handleError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401 || error.response?.status === 504) {
    console.log('未认证')
  }
  return Promise.reject(error)
}

// Request interceptors configuration
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config
}, handleError)

// Respose interceptors configuration
service.interceptors.response.use((response: AxiosResponse) => {
  const data = response.data
  if (data.code === 0) {
    return data.data
  } else {
    return Promise.reject('error')
  }
}, handleError)


class Http {
  get(url: string, params?: object) {
    return service.get(url, { params })
  }
  post(url: string, data?: object) {
    return service.post(url, data)
  }
}

export const http = new Http()


