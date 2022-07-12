import { FC } from "react";

export const IconCurrency: FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <span
      className={className ? "icon-leuro " + className : "icon-leuro"}
    ></span>
  ); //<>Ŀ</>;
};
