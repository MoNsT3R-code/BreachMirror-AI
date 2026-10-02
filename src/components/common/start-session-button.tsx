import React from 'react';

interface StartSessionButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const StartSessionButton: React.FC<StartSessionButtonProps> = ({
  onClick,
  className = '',
  label = 'Start session',
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-light uppercase text-base ${className}`}
    >
      <span
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"
      ></span>

      <span
        className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]"
      ></span>

      <div
        className="relative flex items-center justify-between py-3 px-6 text-sm text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110 shadow-lg shadow-cyan-500/20"
      >
        <span className="select-none font-semibold tracking-wider font-display">{label}</span>

        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 ml-2 -mr-1 transition duration-250 group-hover:translate-x-1"
        >
          <path
            clipRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>
    </button>
  );
};
