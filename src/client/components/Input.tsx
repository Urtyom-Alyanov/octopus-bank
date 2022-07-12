import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export const Input: React.FC<{
  type?: HTMLInputTypeAttribute;
  label: string;
  register: UseFormRegisterReturn;
  errors?: FieldError;
  className?: string;
  wrapperClassName?: string;
}> = ({
  label,
  type = "text",
  register,
  errors,
  className,
  wrapperClassName,
}) => {
  return (
    <label className={`mt-5 block ${wrapperClassName}`}>
      <input
        type={type}
        placeholder={label}
        className={`w-full p-2 rounded-lg outline-none duration-150 ${
          errors
            ? "border-red-400 focus:border-red-300 bg-red-100 border-solid border-2"
            : "bg-gray-100 border-gray-100 border-solid border-2"
        } ${className}`}
        {...register}
      />
      {errors && (
        <span className='text-sm text-red-400'>* {errors.message}</span>
      )}
    </label>
  );
};
