import { IdentityLayout } from '@/client/layouts/IdentityLayout';
import { IOAuthQueryData } from '@/shared/types/IOAuthQueryData';
import { useRouter } from 'next/router';
import { FC, useState, useRef } from 'react';
import { AvatarStep } from './AvatarStep';
import { RegisterStep } from './RegisterStep';

export const RegisterPageComponent: FC<{
  vk_token: string;
  oauth_data: null | string;
  FullName: string;
  VkTag: string;
}> = ({ vk_token, oauth_data, FullName, VkTag }) => {
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'avatar'>('register');
  const queryData = useRef<IOAuthQueryData>();

  const AfterRegister = () => {
    router.push('/oauth', {
      query: {
        ...queryData.current,
        scopes: queryData.current.scopes.join(','),
      },
      pathname: '/oauth/authorize',
    });
  };
  const goToAvatarStep = () => setStep('avatar');

  return (
    <IdentityLayout name="Регистрация">
      {step === 'register' && (
        <RegisterStep
          FullName={FullName}
          VkTag={VkTag}
          oauth_data={oauth_data}
          queryData={queryData}
          vk_token={vk_token}
          goToAvatarStep={goToAvatarStep}
        />
      )}
      {step === 'avatar' && <AvatarStep after={AfterRegister} />}
    </IdentityLayout>
  );
};
