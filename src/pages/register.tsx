import { RegisterPageComponent } from '@/client/page-components/register/RegisterPageComponent';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getServerSideProps as gSSP } from '@/client/page-components/register/getSSP';

const RegisterPage: NextPage<InferGetServerSidePropsType<typeof gSSP>> = ({
  FullName,
  VkTag,
  oauth_data,
  vk_token,
}) => {
  return (
    <RegisterPageComponent
      FullName={FullName}
      VkTag={VkTag}
      oauth_data={oauth_data}
      vk_token={vk_token}
    />
  );
};

export const getServerSideProps = gSSP;

export default RegisterPage;
