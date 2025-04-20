import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// Create axios instance
const service = axios.create({
  baseURL: "/api",
  timeout: 15 * 1000,
  headers: { "Content-Type": "application/json" },
});

// Handle Error
const handleError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401 || error.response?.status === 504) {
    console.log("未认证");
  }
  return Promise.reject(error);
};

// Request interceptors configuration
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
}, handleError);

// Response interceptors configuration
service.interceptors.response.use((response: AxiosResponse) => {
  const data = response.data;
  if (data.code === 0) {
    return data.data;
  } else {
    return Promise.reject("error");
  }
}, handleError);

class Http {
  get<T>(url: string, params?: object): Promise<T> {
    return service.get(url, { params }) as unknown as Promise<T>;
  }
  post<T>(url: string, data?: object): Promise<T> {
    return service.post(url, data) as unknown as Promise<T>;
  }
}

export const http = new Http();
