import axios, { AxiosRequestConfig } from "axios";

const baseConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:8080",
  // baseURL: "https://e2a3-61-90-175-249.ap.ngrok.io/api",
};

export const axiosInstance = axios.create(baseConfig);
