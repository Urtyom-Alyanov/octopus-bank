import { IsScopeInArray, Scope } from '../utils/GetScopeData';
import { ScopeBlock } from './ScopeBlock';
import { ScopesBlock } from './ScopesBlock';

export const Scopes: React.FC<{ Scopes: Scope[] }> = ({ Scopes }) => {
  const ScopeBlocks = Scopes.map((Scope) => (
    <ScopeBlock key={Scope} Scope={Scope} />
  ));
  return (
    <ScopesBlock>
      {ScopeBlocks}
      {!IsScopeInArray(Scopes) && <ScopeBlock Scope="none" />}
    </ScopesBlock>
  );
};
