import React, { FC } from 'react';

const Tick: FC = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M9.5 18.2c-.4.4-1 .4-1.4 0l-3.8-3.8c-.3-.4-.3-1 0-1.4s1-.4 1.4 0l3.1 3.1 8.6-8.6c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-9.3 9.3z" />
    </svg>
  );
};

export default Tick;
