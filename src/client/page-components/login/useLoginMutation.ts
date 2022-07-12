import { httpClient } from '@/client/http';
import {
  IHttpFetchError,
  IHttpFetchErrorMessage,
} from '@/shared/types/IHttpFetchError';
import { IRegisterOrLoginResponse } from '@/shared/types/IRegisterResponse';
import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';

interface ILoginData {
  username: string;
  password: string;
}

export const useLoginMutation = ({
  onSuccess,
  onError,
  oauth_data,
}: {
  onSuccess(data: IRegisterOrLoginResponse): void;
  onError(err: IHttpFetchError): void;
  oauth_data: string | null;
}) =>
  useMutation(
    async (
      login_data: ILoginData,
    ): Promise<IHttpFetchError | IRegisterOrLoginResponse> => {
      const body = {
        ...login_data,
        oauth_data,
      };
      const { data } = await httpClient.post<
        IHttpFetchError | IRegisterOrLoginResponse
      >('/oauth/login', body);
      return data;
    },
    {
      onError: (err: AxiosError<IHttpFetchError | IHttpFetchErrorMessage>) => {
        const data: IHttpFetchError = err.response.data
          ? 'errorCode' in err.response.data
            ? {
                error: err.response.data.errorText,
                statusCode: err.response.data.errorCode,
                message: err.response.data.errorText,
              }
            : err.response.data
          : null;
        onError(
          data || {
            error: err.name,
            message: err.message,
            statusCode: err.code as unknown as number,
          },
        );
      },
      onSuccess: (data) => {
        if ('error' in data) return onError(data);
        onSuccess(data);
      },
    },
  );
