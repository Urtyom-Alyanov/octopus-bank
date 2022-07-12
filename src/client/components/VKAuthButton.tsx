// import {
//   Config,
//   Connect,
//   ConnectEvents,
//   VKAuthButtonCallbackResult,
// } from "@vkontakte/superappkit";
import { OAuthVkClientId } from '@/shared/consts/oauth_vk_client_id';
import { OAuthVkRedirect } from '@/shared/consts/oauth_vk_redirect';
import { FC } from 'react';
// import { appId } from "../../../pages/_app";

export const VKAuthButtonElement: FC<{
  IsLoading?: boolean;
  className?: string;
  actionType: 'login' | 'register';
  type: 'button' | 'submit';
  state?: string;
}> = ({
  IsLoading = false,
  className,
  actionType = 'login',
  type = 'button',
  state,
}) => {
  const authorize_vk_url = new URL('https://oauth.vk.com/authorize');

  authorize_vk_url.searchParams.append('redirect_uri', OAuthVkRedirect);
  authorize_vk_url.searchParams.append('scopes', '65536');
  authorize_vk_url.searchParams.append('response_type', 'code');
  authorize_vk_url.searchParams.append('client_id', OAuthVkClientId.toString());
  if (state) authorize_vk_url.searchParams.append('state', state);

  return (
    <a
      href={authorize_vk_url.toString()}
      onClick={(e) => {
        if (IsLoading) e.preventDefault();
      }}
    >
      <button
        className={`${
          className ? `${className} ` : ''
        }w-full col-span-1 flex items-center cursor-pointer active:opacity-90 active_scale-97 duration-100 justify-between p-2 bg-vk font-semibold text-white`}
        style={{ borderRadius: '10px', height: '44px' }}
        disabled={IsLoading}
        type={type}
      >
        <div
          className="mr-7 flex items-center justify-center"
          style={{ minWidth: '22px', minHeight: '22px' }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 28 28"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="28"
              height="28"
              style={{ maskType: 'alpha' }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.96824 1.96824C0 3.93649 0 7.10432 0 13.44V14.56C0 20.8957 0 24.0635 1.96824 26.0318C3.93649 28 7.10432 28 13.44 28H14.56C20.8957 28 24.0635 28 26.0318 26.0318C28 24.0635 28 20.8957 28 14.56V13.44C28 7.10432 28 3.93649 26.0318 1.96824C24.0635 0 20.8957 0 14.56 0H13.44C7.10432 0 3.93649 0 1.96824 1.96824ZM4.65503 8.75C4.80521 16.0335 8.63806 20.4167 14.9555 20.4167H15.322V16.2498C17.6228 16.4829 19.3387 18.1999 20.0391 20.4167H23.3564C22.4565 17.1005 20.1232 15.267 18.673 14.5665C20.1221 13.7002 22.173 11.6 22.656 8.75H19.6379C19.0047 11.0676 17.1208 13.1679 15.3209 13.3674V8.75H12.2546V16.8337C10.3886 16.3675 7.95442 14.1003 7.85468 8.75H4.65503Z"
                fill="white"
              ></path>
            </mask>
            <g mask="url(#mask0)">
              <rect width="28" height="28" rx="6.72" fill="#fff"></rect>
            </g>
          </svg>
        </div>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {actionType === 'login' ? 'Войти через' : 'Зарегистрироваться'} VK ID
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
    </a>
  );
};
