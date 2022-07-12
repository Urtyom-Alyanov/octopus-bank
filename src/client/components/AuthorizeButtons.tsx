import { AcceptAuthorize } from './AcceptAuthorize';
import { DeclineAuthorize } from './DeclineAuthorize';

export const AuthorizeButtons: React.FC<{
  ClientId: number;
  ResponseType: 'code' | 'token';
  RedirectURI: string;
  Scopes: string[];
  State?: string;
}> = ({ ClientId, RedirectURI, ResponseType, Scopes, State }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DeclineAuthorize RedirectURI={RedirectURI} />
      <AcceptAuthorize
        ClientId={ClientId}
        RedirectURI={RedirectURI}
        ResponseType={ResponseType}
        Scopes={Scopes}
        State={State}
      />
    </div>
  );
};
