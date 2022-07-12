import { PropsWithChildren } from 'react';

export const ScopesBlock: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="bg-slate-100 p-4 my-4 rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Права</h3>
      <div>{children}</div>
    </div>
  );
};
