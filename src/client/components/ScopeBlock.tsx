import { GetScopeData, Scope } from '../utils/GetScopeData';

export const ScopeBlock: React.FC<{ Scope: Scope | 'none' }> = ({ Scope }) => {
  const scopeData = GetScopeData(Scope);
  if (!scopeData) return null;
  return (
    <div className="flex gap-3 mt-2 pt-2 border-t-slate-300 border-t-2 border-solid">
      <div>
        {scopeData.ScopeImageSrc ? (
          <img src={scopeData.ScopeImageSrc} alt="Scope image" />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-slate-500"></div>
        )}
      </div>
      <div>
        <h1 className="font-semibold">{scopeData.ScopeName}</h1>
        <p className="text-sm text-slate-300">{scopeData.ScopeDesc}</p>
      </div>
    </div>
  );
};
