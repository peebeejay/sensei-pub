import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { DateTime } from 'luxon';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import WeekDrop from '../components/WeekDrop';
import PlannerProvider from '../components/PlannerProvider';
import { DATE_FORMAT } from '../constants';

export default {
  title: 'Week Drop',
};

const Wrapper = styled.div`
  margin: ${rem(20)};
  max-width: ${rem(300)};
`;

export const weekDrop = () => {
  const onDragEnd = (_: DropResult) => {
    console.log('here');
  };

  return (
    <PlannerProvider>
      <Wrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <WeekDrop
            impliedId={DateTime.local().toFormat(DATE_FORMAT)}
            isFlipped={false}
            uponClick={() => console.log('clicking!')}
          />
        </DragDropContext>
      </Wrapper>
    </PlannerProvider>
  );
};
