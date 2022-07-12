import Image from 'next/image';
import { MouseEventHandler } from 'react';
import PBMIcon from '../images/svg/PBM_back.svg';

export const PBMAuthButton: React.FC<{
  IsLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  className?: string;
  actionType?: 'register' | 'login';
}> = ({
  IsLoading = false,
  onClick,
  type = 'submit',
  className,
  actionType = 'login',
}) => {
  return (
    <button
      className={`${
        className ? `${className} ` : ''
      }w-full col-span-1 flex items-center cursor-pointer active:opacity-90 active_scale-97 duration-100 justify-between p-2 bg-first-500 font-semibold text-white`}
      style={{ borderRadius: '10px', height: '44px' }}
      disabled={IsLoading}
      onClick={onClick}
      type={type}
    >
      <div
        className="mr-7 flex items-center justify-center"
        style={{ minWidth: '22px', minHeight: '22px' }}
      >
        <Image
          src={PBMIcon.src}
          width={22}
          height={22}
          alt="PBM Logo"
          className="rotate-45"
        />
      </div>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {actionType === 'login' ? 'Войти через' : 'Зарегистрироваться'} НБМ
      </span>
      <div
        className="flex items-center justify-center animate-spin ml-7"
        style={{ width: 22, height: 22 }}
      >
        <svg
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          className={`fill-white${!IsLoading ? ' hidden' : ''}`}
        >
          <path
            d="M8 16a1 1 0 110-2 6 6 0 10-5.7-4.12 1 1 0 11-1.9.626A8 8 0 118 16z"
            fill="currentColor"
            fillRule="nonzero"
          ></path>
        </svg>
      </div>
    </button>
  );
};
