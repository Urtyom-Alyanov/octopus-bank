import { AvatarBoilerplate } from './AvatarBoilerplate';
import { HeaderTextOAuth } from './HeaderTextOAuth';

export const OAuthHeader: React.FC<{
  ClientImageSrc?: string;
  AccountImageSrc?: string;
  AccountName: string;
  ClientName: string;
}> = ({ AccountName, ClientName, AccountImageSrc, ClientImageSrc }) => {
  return (
    <div className="flex gap-3 justify-between">
      <div>
        <AvatarBoilerplate src={ClientImageSrc} />
      </div>
      <div className="flex-1">
        <HeaderTextOAuth AccountName={AccountName} ClientName={ClientName} />
      </div>
      <div>
        <AvatarBoilerplate src={AccountImageSrc} />
      </div>
    </div>
  );
};
