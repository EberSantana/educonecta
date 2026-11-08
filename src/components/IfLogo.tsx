import React from 'react';

interface IfLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightText?: boolean;
}

/**
 * Official Instituto Federal (IF) Brand Emblem & Wordmark
 * Colors: Verde Institucional (#1e7e34), Vermelho Institucional (#ce2029)
 */
export const IfLogo: React.FC<IfLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = false,
}) => {
  const sizeMap = {
    sm: { iconSize: 24, textSize: 'text-xs', subSize: 'text-[9px]' },
    md: { iconSize: 32, textSize: 'text-sm', subSize: 'text-[10px]' },
    lg: { iconSize: 42, textSize: 'text-base', subSize: 'text-xs' },
  };

  const { iconSize, textSize, subSize } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official IF Symbol Matrix (9 green squares + 1 red dot) */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="Logo Instituto Federal"
      >
        {/* Red Dot (Dot of the "i") */}
        <circle cx="18" cy="18" r="14" fill="#ce2029" />

        {/* Green Blocks (Forming the stylized IF) */}
        {/* Row 1 */}
        <rect x="38" y="4" width="26" height="26" rx="4" fill="#1e7e34" />
        <rect x="70" y="4" width="26" height="26" rx="4" fill="#1e7e34" />

        {/* Row 2 */}
        <rect x="4" y="38" width="26" height="26" rx="4" fill="#1e7e34" />
        <rect x="38" y="38" width="26" height="26" rx="4" fill="#1e7e34" />
        <rect x="70" y="38" width="26" height="26" rx="4" fill="#1e7e34" />

        {/* Row 3 */}
        <rect x="4" y="70" width="26" height="26" rx="4" fill="#1e7e34" />
        <rect x="38" y="70" width="26" height="26" rx="4" fill="#1e7e34" />
      </svg>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-extrabold tracking-tight ${textSize} ${
                lightText ? 'text-white' : 'text-slate-900'
              }`}
            >
              Edu<span className="text-[#1e7e34]">Conecta</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#ce2029] text-white tracking-wider uppercase">
              IFS
            </span>
          </div>
          <span
            className={`block font-medium ${subSize} ${
              lightText ? 'text-emerald-100' : 'text-slate-500'
            }`}
          >
            Campus Tobias Barreto · COINF
          </span>
        </div>
      )}
    </div>
  );
};
