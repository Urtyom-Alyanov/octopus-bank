import { httpClient } from '@/client/http';
import { IAccount } from '@/shared/types/IAccount';
import { ICropData } from '@/shared/types/ICropData';
import {
  IHttpFetchError,
  IHttpFetchErrorMessage,
} from '@/shared/types/IHttpFetchError';
import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';

export const useUploadAvatarMutation = ({
  onError,
  onSuccess,
}: {
  onSuccess: (data: IAccount) => void;
  onError: (err: IHttpFetchError) => void;
}) =>
  useMutation(
    async (Data: ICropData & { image: File }) => {
      const newformdata = new FormData();

      newformdata.append('file', Data.image);
      newformdata.append('y', Data.y.toString());
      newformdata.append('x', Data.x.toString());
      newformdata.append('height', Data.height.toString());
      newformdata.append('width', Data.width.toString());
      newformdata.append('rotation', Data.rotation.toString());

      const { data } = await httpClient.post<IAccount | IHttpFetchError>(
        '/methods/account/avatar-upload',
        newformdata,
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
          JSON.stringify(data) !== '{}'
            ? data
            : {
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
