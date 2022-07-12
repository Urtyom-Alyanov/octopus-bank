import { FC, MouseEventHandler, PropsWithChildren } from "react";

interface Props {
  Type?: "button" | "reset" | "submit";
  OnClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  Second?: boolean;
}

export const Button: FC<PropsWithChildren<Props>> = ({
  Type,
  OnClick,
  children,
  className,
  Second = false,
}) => {
  return (
    <button
      className={
        `${
          !Second
            ? "bg-first-500 hover:bg-first-400 text-white"
            : "bg-white hover:bg-second-100 text-first-400"
        } p-2 rounded-lg ` + className
      }
      type={Type}
      onClick={OnClick}
    >
      {children}
    </button>
  );
};
