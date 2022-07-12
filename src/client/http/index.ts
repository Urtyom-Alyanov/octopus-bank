import axios, { AxiosError } from 'axios';

export const httpClient = axios.create({
  withCredentials: true,
  baseURL: 'http://192.168.0.67:3000/',
});

httpClient.interceptors.response.use(
  (config) => config,
  async (error: AxiosError<any>) => {
    const config = { _isRetry: false, ...error.config };

    if (
      error?.response?.status === 401 &&
      config &&
      !config._isRetry &&
      error?.response?.data?.errorCode === 102
    ) {
      config._isRetry = true;

      const httpClientRefresh = axios.create({
        withCredentials: true,
        baseURL: 'http://192.168.0.67:3000/',
      });

      try {
        const { data } = await httpClientRefresh.post('/oauth/refresh');
        if (data?.status === 'ok') return httpClient.request(config);
      } catch (e) {}
    }

    throw error;
  },
);
