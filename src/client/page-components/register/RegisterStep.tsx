import { ErrorAlert } from '@/client/components/ErrorAlert';
import { Input } from '@/client/components/Input';
import { PageBlock } from '@/client/components/PageBlock';
import { PBMAuthButton } from '@/client/components/PBMAuthButton';
import { IHttpFetchError } from '@/shared/types/IHttpFetchError';
import { IOAuthQueryData } from '@/shared/types/IOAuthQueryData';
import { getMaxValue } from '@/shared/funcs/getMaxValue';
import { getMinValue } from '@/shared/funcs/getMinValue';
import { getPattern } from '@/shared/funcs/getPattern';
import { getRequired } from '@/shared/funcs/getRequired';
import { FC, MutableRefObject, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DataRegisterT } from './DataRegisterT';
import { useRegisterMutation } from './useRegisterMutation';

export const RegisterStep: FC<{
  vk_token: string;
  oauth_data: string | null;
  FullName: string;
  VkTag: string;
  queryData: MutableRefObject<IOAuthQueryData>;
  goToAvatarStep: () => void;
}> = ({ vk_token, oauth_data, FullName, VkTag, queryData, goToAvatarStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DataRegisterT>({
    defaultValues: {
      tag: VkTag,
      name: FullName,
    },
  });
  const [Error, SetError] = useState<IHttpFetchError | null>(null);

  const { mutate, isLoading } = useRegisterMutation({
    oauth_data,
    vk_token,
    onError(err) {
      SetError(err);
    },
    onSuccess(data) {
      queryData.current = data.Redirect.QueryData;
      goToAvatarStep();
    },
  });

  const ClearError = () => SetError(null);

  const pass = useRef('');
  pass.current = watch('password', '');

  const Handler: SubmitHandler<DataRegisterT> = (data) => {
    mutate(data);
  };

  return (
    <PageBlock>
      <h1 className="text-xl">Регистрация</h1>
      {Error && <ErrorAlert Error={Error} ClearError={ClearError} />}
      <p className="text-second">Завершите регистрацию, {FullName}!</p>
      <form onSubmit={handleSubmit(Handler)}>
        <h1 className="text-lg mt-3">Данные пользователя</h1>
        <Input
          register={register('username', {
            required: getRequired(true, 'логин'),
            minLength: getMinValue(6, 'логине'),
            maxLength: getMaxValue(32, 'логине'),
            pattern: getPattern('Логин'),
          })}
          label="Логин"
          type="text"
          errors={errors.username}
        />
        <Input
          register={register('password', {
            required: getRequired(true, 'пароль'),
            minLength: getMinValue(6, 'пароле'),
            maxLength: getMaxValue(32, 'пароле'),
            pattern: getPattern('Пароль'),
          })}
          label="Пароль"
          type="password"
          errors={errors.password}
        />
        <Input
          register={register('password_verify', {
            validate: (value) =>
              value === pass.current || 'Пароли не совпадают',
          })}
          label="Повторение пароля"
          type="password"
          errors={errors.password_verify}
        />
        <h1 className="text-lg mt-3 pt-3 border-t-second-200 border-solid border-t-2">
          Данные аккаунта
        </h1>
        <Input
          register={register('name', {
            required: getRequired(true, 'имя'),
            minLength: getMinValue(6, 'имени'),
            maxLength: getMaxValue(32, 'имени'),
          })}
          label="Имя аккаунта"
          type="text"
          errors={errors.name}
        />
        <Input
          register={register('tag', {
            required: getRequired(true, 'тэг'),
            minLength: getMinValue(6, 'тэге'),
            maxLength: getMaxValue(32, 'тэге'),
            pattern: getPattern('Тэг'),
          })}
          label="Тэг аккаунта"
          type="text"
          errors={errors.tag}
        />
        <PBMAuthButton
          className="mt-3"
          actionType="register"
          IsLoading={isLoading}
        />
      </form>
    </PageBlock>
  );
};
