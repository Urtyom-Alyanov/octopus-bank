import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  Register: UseFormRegisterReturn;
  Label: string;
  Errors?: FieldError;
}

export const Checkbox: FC<Props> = ({ Register, Label, Errors }) => {
  const id = Math.random().toString();
  return (
    <div className='mt-5'>
      <input
        type='checkbox'
        className='invisible -z-10 absolute peer'
        id={id}
        {...Register}
      />
      <label
        htmlFor={id}
        className='inline-flex items-center select-none before:inline-block before:duration-150 before:w-6 before:h-6 before:flex-shrink-0 before:flex-grow-0 before:border-second-200 before:border-solid before:border-2 before:rounded-lg before:mr-2 before:bg-no-repeat before:bg-center peer-checked:before:bg-first-500 peer-checked:before:border-first-500 cursor-pointer peer-checked:before:bg-1/2 peer-checked:before:bg-checkbox'
      >
        {Label}
      </label>
      {Errors && (
        <span className='text-sm text-red-400'>* {Errors.message}</span>
      )}
    </div>
  );
};
