import { ChangeEventHandler, FC, FocusEventHandler } from 'react';

type Props = {
  name: string;
  value: string;
  label?: string;
  rows?: number;
  placeholder?: string;
  isError?: boolean;
  errorText?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

export const TextArea: FC<Props> = ({
  name,
  value,
  rows,
  label,
  placeholder,
  isError,
  errorText,
  onBlur,
  onChange,
}) => {
  return (
    <label className="relative flex flex-col gap-2 font-semibold">
      {label}
      <textarea
        className={`font-normal px-5 py-4 rounded-[50px] transition-all duration-150 outline-none border ${
          isError
            ? 'border-red-400 focus:border-red-400'
            : 'border-slate-300 focus:border-slate-500'
        }`}
        name={name}
        rows={rows ?? 4}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
      {isError && (
        <div className="absolute left-4 -bottom-5 font-normal text-red-400 text-xs">
          {errorText}
        </div>
      )}
    </label>
  );
};
