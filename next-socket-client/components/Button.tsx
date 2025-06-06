import React, { forwardRef } from 'react';

type ClickType = {
  onClick: () => void;
};

const Button = forwardRef<HTMLButtonElement, ClickType>(({ onClick }, ref) => {
  return (
    <button
      className="flex h-[40px] w-[90px] cursor-pointer items-center justify-center rounded-[8px] bg-black font-medium text-white lg:h-[40px] lg:w-[100px] lg:text-[17px] dark:bg-white dark:text-black"
      onClick={onClick}
      ref={ref}
    >
      <div className="svg-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-[16px] w-[16px] pt-[1px] lg:h-[20px] lg:w-[20px]"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            fill="currentColor"
            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
          />
        </svg>
      </div>
      <span className="p-[4px] lg:p-[6px]">Send</span>
    </button>
  );
});

export default Button;
