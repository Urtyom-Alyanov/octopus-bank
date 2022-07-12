export const AcceptAuthorize: React.FC<{
  ClientId: number;
  ResponseType: 'code' | 'token';
  RedirectURI: string;
  Scopes: string[];
  State?: string;
}> = ({ ClientId, RedirectURI, ResponseType, Scopes, State }) => {
  return (
    <form action="/oauth/authorize/accept" method="post">
      <input type="hidden" name="client_id" value={ClientId} />
      <input type="hidden" name="response_type" value={ResponseType} />
      <input type="hidden" name="redirect_uri" value={RedirectURI} />
      <input type="hidden" name="scopes" value={Scopes} />
      <input type="hidden" name="state" value={State} />
      <button className="p-2 rounded-lg w-full bg-green-400 hover:bg-green-300 duration-150 font-semibold text-white">
        Принять
      </button>
    </form>
  );
};
