import { IHttpFetchError } from '@/shared/types/IHttpFetchError';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ErrorAlert: React.FC<{
  Error: IHttpFetchError;
  ClearError: () => void;
}> = ({ ClearError, Error }) => {
  return (
    <div className="bg-red-200 p-2 border-l-2 mt-3 border-l-red-400 border-solid rounded-r-md">
      <div className="flex justify-between items-center">
        <p className="text-lg">
          {Error
            ? typeof Error.message === 'string'
              ? Error.message
              : `${Error.message.errorText} (${Error.message.errorCode})`
            : 'Ничего нет'}
        </p>
        <div
          onClick={() => ClearError()}
          className="group select-none duration-150 flex items-center justify-center p-1 cursor-pointer bg-red-300 hover:bg-red-400 active:bg-red-200 rounded-md"
        >
          <FontAwesomeIcon
            icon={faClose}
            className="fill-black group-hover:fill-slate-700 duration-150 group-active:fill-slate-800"
            fixedWidth
          />
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        Status code -{' '}
        {Error ? (
          <>
            {Error.statusCode} {Error.error}
          </>
        ) : (
          'Ничего нет, жесть'
        )}
      </p>
    </div>
  );
};
