import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useLayoutEffect,
} from 'react';

export const Modal: FC<
  PropsWithChildren<{
    IsActive: boolean;
    SetActive: Dispatch<SetStateAction<boolean>>;
    Title?: string;
    AddPadding?: boolean;
  }>
> = ({ IsActive, SetActive, children, Title, AddPadding = false }) => {
  useLayoutEffect(() => {
    if (IsActive) document.body.classList.add('overflow-hidden');
    if (!IsActive) document.body.classList.remove('overflow-hidden');
  }, [IsActive]);

  return (
    <>
      {IsActive && (
        <div
          className="z-30 w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.31)]"
          onClick={() => SetActive(false)}
        >
          <div className="md:wrapper h-full">
            <div
              className="h-full flex flex-col md:justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={'md:rounded-t-lg bg-first-500 p-4'}>
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {Title}
                    </h4>
                  </div>
                  <div>
                    <div
                      onClick={() => SetActive(false)}
                      className="group select-none duration-150 flex items-center justify-center p-1 cursor-pointer hover:bg-first-400 active:bg-first-500 rounded-md"
                    >
                      <FontAwesomeIcon
                        icon={faClose}
                        className="fill-white group-hover:fill-gray-100 duration-150 group-active:fill-gray-200"
                        fixedWidth
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  'md:rounded-b-lg overflow-y-auto flex-1 md:flex-none bg-white max-h-full' +
                  (AddPadding ? ' p-4' : '')
                }
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
