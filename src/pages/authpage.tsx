import { Input } from '@/client/components/Input';
import { PageBlock } from '@/client/components/PageBlock';
import { PBMAuthButton } from '@/client/components/PBMAuthButton';
import { VKAuthButtonElement } from '@/client/components/VkAuthButton';
import { IdentityLayout } from '@/client/layouts/IdentityLayout';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { getMaxValue } from '@/shared/funcs/getMaxValue';
import { getMinValue } from '@/shared/funcs/getMinValue';
import { getPattern } from '@/shared/funcs/getPattern';
import { getRequired } from '@/shared/funcs/getRequired';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/client/page-components/login/useLoginMutation';
import { IHttpFetchError } from '@/shared/types/IHttpFetchError';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ErrorAlert } from '@/client/components/ErrorAlert';

export const getServerSideProps: GetServerSideProps<{
  oauth_data: string;
}> = async ({ query }) => {
  const oauth_data = query?.oauth_data as string | null;

  return {
    props: {
      oauth_data,
    },
  };
};

const AuthPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ oauth_data }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    username: string;
    password: string;
  }>();

  const router = useRouter();

  const [Error, SetError] = useState<IHttpFetchError | null>(null);
  const ClearError = () => SetError(null);

  const { mutate } = useLoginMutation({
    oauth_data,
    onSuccess(data) {
      router.push('/oauth', {
        query: {
          ...data.Redirect.QueryData,
          scopes: data.Redirect.QueryData.scopes.join(','),
        },
        pathname: '/oauth/authorize',
      });
    },
    onError(err) {
      SetError(err);
    },
  });

  const onValid = (data: { username: string; password: string }) => {
    mutate(data);
  };

  return (
    <IdentityLayout name="????????">
      <PageBlock>
        {Error && <ErrorAlert Error={Error} ClearError={ClearError} />}
        <form onSubmit={handleSubmit(onValid)}>
          <h1 className="text-xl">??????????</h1>
          <Input
            label="??????????"
            register={register('username', {
              required: getRequired(true, '??????????'),
              minLength: getMinValue(6, '????????????'),
              maxLength: getMaxValue(32, '????????????'),
              pattern: getPattern('??????????'),
            })}
            errors={errors['username']}
          />
          <Input
            label="????????????"
            register={register('password', {
              required: getRequired(true, '????????????'),
              minLength: getMinValue(6, '????????????'),
              maxLength: getMaxValue(32, '????????????'),
              pattern: getPattern('????????????'),
            })}
            type="password"
            errors={errors['password']}
          />
          <div className="grid-cols-2 grid gap-4 mt-4">
            <PBMAuthButton />
            <VKAuthButtonElement
              actionType="login"
              type="button"
              state={oauth_data}
            />
          </div>
          <p className="text-second-500 mt-2">
            * ?????? ????????, ?????? ???? ????????????????????????????????????, ?????????????? ???? ???????????? ??????????????????????
            ?????????? ??????????????????. <br />* ?????? ?????????????????????? <b>????</b> ?????????????????? ??????????
          </p>
        </form>
      </PageBlock>
    </IdentityLayout>
  );
};

export default AuthPage;
