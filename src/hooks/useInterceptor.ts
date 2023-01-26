import { useEffect } from "react";
import { InternalAxiosRequestConfig } from "axios";

import useUser from "./useUser";
import { axiosInstance } from "../services/provider";

const useInterceptor = () => {
  const [{ token }, { logout, onRefreshToken }] = useUser();

  useEffect(() => {
    if (!token) return;

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const isRetry = config.headers.get("_retry");

        if (isRetry) config.headers.delete("_retry");
        else config.headers.set("Authorization", token);

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error) => {
        const { config, response } = error;
        const newConfig = { ...config } as InternalAxiosRequestConfig;
        const isRetry = newConfig.headers.get("_retry");

        // retried but error.
        if (!!isRetry) {
          logout();

          return Promise.reject(error);
        }

        // 401 and not retrying.
        if (!isRetry && response?.status === 401) {
          try {
            const { data } = await axiosInstance.post("/refresh-token");

            onRefreshToken({ ...data });

            newConfig.headers.set("_retry", true);
            newConfig.headers.set("Authorization", data?.token);

            return axiosInstance(newConfig);
          } catch (error) {
            logout();

            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);
};

export default useInterceptor;
