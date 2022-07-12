export interface IScopeData {
  ScopeName: string;
  ScopeDesc: string;
  ScopeImageSrc?: string;
}
export type Scope = 'account' | 'refresh';
export const Scope: Scope[] = ['account', 'refresh'];

export const ScopeData: { [name in Scope]: IScopeData } = {
  account: {
    ScopeDesc: 'Даёт доступ к аккаунту и его действиям',
    ScopeName: 'Аккаунт',
  },
  refresh: {
    ScopeName: 'Перезапуск токена',
    ScopeDesc:
      'Выдаёт приложению 2 токена, один из которых служит для перезапуска первого',
  },
};

export const GetScopeData = (scope: Scope | 'none'): IScopeData =>
  scope !== 'none'
    ? ScopeData[scope]
    : {
        ScopeDesc: 'Данное приложение не требует прав',
        ScopeName: 'Нет прав',
      };

export const IsScope = (scope: string) =>
  Scope.filter((val) => val === scope).length > 0;
export const IsScopeInArray = (scope: string[]) => {
  let isScope = false;

  scope.forEach((scope) => {
    if (isScope) return;
    if (IsScope(scope)) isScope = true;
  });

  return isScope;
};
export const IsOnlyScopeInArray = (scope: string[]) => {
  let isScope = false;
  const isScopes: boolean[] = [];

  scope.forEach((scope) => {
    if (IsScope(scope)) isScopes.push(true);
    else isScopes.push(false);
  });

  if (isScopes.filter((val) => !val).length <= 0) isScope = true;

  return isScope;
};
