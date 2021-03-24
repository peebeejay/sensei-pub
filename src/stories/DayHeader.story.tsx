import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import DayHeader from '../components/DayHeader';
import { DateTime } from 'luxon';
import PlannerProvider from '../components/PlannerProvider';

const testData = {
  date: DateTime.local(),
};

export default {
  title: 'DayHeader',
};

const Container = styled.div`
  width: 14vw;
  margin: ${rem(15)};
`;

export const dayHeader = () => {
  return (
    <PlannerProvider>
      <Container>
        <DayHeader isDraggingOver={false} date={testData.date} />
      </Container>
    </PlannerProvider>
  );
};
