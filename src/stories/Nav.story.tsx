import React from 'react';
import Nav from '../components/Nav';
import PlannerProvider from '../components/PlannerProvider';

export default {
  title: 'Nav',
};

export const nav = () => {
  return (
    <PlannerProvider>
      <Nav handleLogout={() => console.log('Logging out')} />
    </PlannerProvider>
  );
};
