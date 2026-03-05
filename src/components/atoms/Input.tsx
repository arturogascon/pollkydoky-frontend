import React from "react";

type InputProps = {
  label?: string;
  error?: string;
} & React.ComponentProps<"input">;

const Input = ({ error, label, name, ref, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col my-1 w-full">
      {label && (
        <label
          className={`block text-sm font-medium mb-1.5 ml-1.5 select-none leading-none`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        className="file:text-foreground 
        placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-border h-9 w-full min-w-0 rounded-3xl border bg-transparent px-3 py-1 text-base shadow-xs 
        transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed 
        disabled:opacity-50 md:text-sm 
        focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
        aria-invalid:ring-error/20 aria-invalid:border-error"
        id={name}
        name={name}
        ref={ref}
        {...rest}
      />
      <span className="text-xs text-error leading-none">{error}</span>
    </div>
  );
};

export default Input;
