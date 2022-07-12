export const DeclineAuthorize: React.FC<{
  RedirectURI: string;
}> = ({ RedirectURI }) => {
  return (
    <form action="/oauth/authorize/deny" method="post">
      <input type="hidden" name="redirect_uri" value={RedirectURI} />
      <button className="p-2 rounded-lg w-full bg-red-400 hover:bg-red-500 duration-150 font-semibold text-white">
        Отклонить
      </button>
    </form>
  );
};
