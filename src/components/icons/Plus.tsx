import React, { FC } from 'react';

const Plus: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <path d="M26 14h-8V6c0-1.1-.9-2-2-2s-2 .9-2 2v8H6c-1.1 0-2 .9-2 2s.9 2 2 2h8v8c0 1.1.9 2 2 2s2-.9 2-2v-8h8c1.1 0 2-.9 2-2s-.9-2-2-2z" />
    </svg>
  );
};

export default Plus;
