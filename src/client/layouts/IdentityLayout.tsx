import PBMIdentity from '@/client/images/svg/PBM_Identity_fulllogo.svg';
import Head from 'next/head';
import { PropsWithChildren } from 'react';

export const IdentityLayout: React.FC<PropsWithChildren<{ name: string }>> = ({
  name,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{`${name} | НБМ Identity`}</title>
      </Head>
      <div className="flex flex-col justify-center h-full overflow-auto">
        <div className="grid grid-cols-12 container mx-auto">
          <div className="col-span-4 col-start-5 sm:col-span-6 mb-6 sm:col-start-4 md:col-span-4 md:col-start-5 lg:col-start-6 lg:col-span-2">
            <img src={PBMIdentity.src} alt="PBM Identity" />
          </div>
          <div className="col-span-12 sm:col-span-10 sm:col-start-2 md:col-span-6 md:col-start-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
