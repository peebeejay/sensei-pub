import React from 'react';
import PlannerProvider from '../components/PlannerProvider';
import Planner from '../components/Planner';
import Nav from '../components/Nav';
import HotKeys from '../components/HotKeys';
import Snackbar from '../components/Snackbar';
import { PlannerWrapper } from '../components/App';

export default {
  title: 'Planner',
};

export const plannerWeek = () => {
  return (
    <PlannerProvider>
      <Nav handleLogout={() => console.log('Logging out')} />
      <PlannerWrapper>
        <Planner />
      </PlannerWrapper>
      <HotKeys />
      <Snackbar />
    </PlannerProvider>
  );
};
