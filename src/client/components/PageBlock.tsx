import { PropsWithChildren } from 'react';

export const PageBlock: React.FC<
  PropsWithChildren<{ NoWithPadding?: boolean }>
> = ({ NoWithPadding = false, children }) => {
  return (
    <div className="bg-white rounded-none sm:rounded-lg shadow-md">
      {NoWithPadding ? children : <div className="p-4">{children}</div>}
    </div>
  );
};
