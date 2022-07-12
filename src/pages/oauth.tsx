import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { IdentityLayout } from '@/client/layouts/IdentityLayout';
import { AuthorizeButtons } from '@/client/components/AuthorizeButtons';
import { Scopes } from '@/client/components/Scopes';
import { OAuthHeader } from '@/client/components/OAuthHeader';
import { PageBlock } from '@/client/components/PageBlock';
import { Scope } from '@/client/utils/GetScopeData';

const OAuth: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({
  RedirectURI,
  Scopes: __Scopes,
  ClientId,
  ClientName,
  ResponseType,
  AccImgSrc,
  AccName,
  ClientImgSrc,
  State,
}) => {
  return (
    <IdentityLayout name="Запрос доступа">
      <PageBlock>
        <OAuthHeader
          AccountName={AccName}
          ClientName={ClientName}
          AccountImageSrc={AccImgSrc}
          ClientImageSrc={ClientImgSrc}
        />
        <Scopes Scopes={__Scopes} />
        <AuthorizeButtons
          ClientId={Number(ClientId)}
          RedirectURI={RedirectURI}
          ResponseType={ResponseType}
          Scopes={__Scopes}
          State={State}
        />
      </PageBlock>
    </IdentityLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  RedirectURI: string;
  Scopes: Scope[];
  ClientId: string;
  ClientName: string;
  ResponseType: 'token' | 'code';
  AccImgSrc: string;
  ClientImgSrc: string;
  AccName: string;
  State?: string;
}> = async ({ query }) => {
  const ClientId = query['client_id'] as string;
  const ClientName = query['client_name'] as string;
  let Scopes = query['scopes'] as string[] as Scope[];
  const RedirectURI = query['redirect_uri'] as string;
  const ResponseType = query['response_type'] as 'code' | 'token';
  const AccImgSrc = query['acc_img_src'] as string;
  const ClientImgSrc = query['client_img_src'] as string;
  const AccName = query['acc_name'] as string;
  const State = query['state'] as string | undefined;

  return {
    props: {
      ClientId,
      ClientName,
      Scopes,
      RedirectURI,
      ResponseType,
      AccImgSrc,
      AccName,
      ClientImgSrc,
      State: State || null,
    },
  };
};

export default OAuth;
