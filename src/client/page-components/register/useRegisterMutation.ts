import { httpClient } from '@/client/http';
import {
  IHttpFetchError,
  IHttpFetchErrorMessage,
} from '@/shared/types/IHttpFetchError';
import { IRegisterOrLoginResponse } from '@/shared/types/IRegisterResponse';
import { IRegisterBody } from '@/shared/types/RegisterBody';
import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { DataRegisterT } from './DataRegisterT';

export const useRegisterMutation = ({
  oauth_data,
  vk_token,
  onSuccess,
  onError,
}: {
  oauth_data: string | null;
  vk_token: string;
  onSuccess: (data: IRegisterOrLoginResponse) => void;
  onError: (err: IHttpFetchError) => void;
}) => {
  return useMutation(
    async (
      Data: DataRegisterT,
    ): Promise<IRegisterOrLoginResponse | IHttpFetchError> => {
      const body: IRegisterBody = {
        account_name: Data.name,
        account_tag: Data.tag,
        oauth_data,
        vk_token,
        password: Data.password,
        username: Data.username,
        check_password: Data.password_verify,
      };
      const { data } = await httpClient.post<IRegisterOrLoginResponse>(
        '/oauth/register',
        body,
      );
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
};
