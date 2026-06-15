import React from 'react';

interface ForgeLogoProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number;
  className?: string;
}

export default function ForgeLogo({ size = 24, className, ...props }: ForgeLogoProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="forgeFlameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" /> {/* Vibrant Amber/Orange */}
          <stop offset="100%" stopColor="#FBBF24" /> {/* Lighter Golden Yellow */}
        </linearGradient>
      </defs>
      
      {/* Flame-styled double-crested 'F' path representing the provided logo design */}
      <path
        d="M 120 420 
           L 120 220 
           C 120 160, 160 120, 220 120 
           L 340 120 
           C 345 90, 335 55, 320 30 
           C 355 55, 370 100, 368 125 
           C 370 85, 410 115, 395 160 
           C 382 190, 345 200, 310 200 
           L 170 200 
           L 170 250 
           L 320 250 
           L 290 300 
           L 170 300 
           L 170 420 
           Z
           M 170 350 
           L 170 420 
           L 195 420 
           L 195 350 
           Z"
        fill="url(#forgeFlameGradient)"
        stroke="url(#forgeFlameGradient)"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
