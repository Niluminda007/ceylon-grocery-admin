import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

interface FetcherConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: any;
}

export const fetcher = async <T>({
  url,
  method = "GET",
  data,
  params,
  ...config
}: FetcherConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url,
      method,
      data,
      params,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw error;
    }
  }
};
