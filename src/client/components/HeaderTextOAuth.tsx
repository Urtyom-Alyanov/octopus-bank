export const HeaderTextOAuth: React.FC<{
  ClientName: string;
  AccountName: string;
}> = ({ AccountName, ClientName }) => (
  <>
    <h1 className="sm:text-lg md:text-base lg:text-lg font-semibold">
      Приложение "{ClientName}" запрашивает доступ
    </h1>
    <p className="text-xs sm:text-sm md:text-xs lg:text-sm text-slate-300">
      К вашему аккаунту "{AccountName}"
    </p>
  </>
);
