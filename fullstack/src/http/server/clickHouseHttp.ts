import axios from 'axios'

export const clickHouseHttp = axios.create({
  baseURL: 'https://www.okx.com/api',
  timeout: 10 * 1000,
  headers: { 'Content-Type': 'application/json' }
})
