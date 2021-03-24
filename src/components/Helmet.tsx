import React, { useContext } from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';
import { PlannerState } from './PlannerProvider';

const Helmet = () => {
  const { startDate } = useContext(PlannerState);
  return (
    <ReactHelmet>
      <meta charSet="utf-8" />
      <title>{`Week ${startDate.toFormat('WW')} - Sensei | PuntaNET`}</title>
      <link rel="canonical" href="http://s.jay.gg" />
    </ReactHelmet>
  );
};

export default Helmet;
