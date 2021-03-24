import React, { FC, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { PlannerState, PlannerDispatch } from './PlannerProvider';
import TaskList from './TaskList';
import { DATE_FORMAT, DAYS_IN_WEEK } from '../constants';
import WeekDrop from './WeekDrop';
import { changeStartDate } from './PlannerProvider/state';
import { noctisAzureus as na } from '../theme';

const Day = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

const WeekDropBack = styled.div`
  display: flex;
  border-right: ${rem(1)} solid ${na.borders.separator1};
`;

const WeekDropForward = styled.div`
  display: flex;
  border-left: ${rem(1)} solid ${na.borders.separator1};
`;

const Planner: FC = () => {
  const { moveItem, updateState } = useContext(PlannerDispatch);
  const state = useContext(PlannerState);
  const { tasks, startDate } = state;

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (destination) {
        moveItem(source, destination, draggableId);
      }
    },
    [tasks],
  );

  /**
   * To render the task lists, we generate a set of 7 dates (of the week) via state.startDate
   * And from there, we create a task list for each of the 7 dates, using the date as the key for the
   * state.tasks.
   *
   * It was written this way in order to allow the presevation of task data within state.
   */
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <WeekDropBack>
        <WeekDrop
          impliedId={startDate.minus({ day: 1 }).toFormat(DATE_FORMAT)}
          isFlipped={false}
          uponClick={() => updateState(changeStartDate(-1))}
        />
      </WeekDropBack>
      <Content>
        {[...Array(DAYS_IN_WEEK).keys()]
          .map((i) => startDate.plus({ days: i }).toFormat(DATE_FORMAT))
          .map((listId, i: number) => {
            const date = startDate.plus({ days: i });
            return (
              <Day key={`${listId}-${i}`}>
                <TaskList listId={listId} taskList={tasks[listId]} date={date} />
              </Day>
            );
          })}
      </Content>
      <WeekDropForward>
        <WeekDrop
          impliedId={startDate.plus({ day: 7 }).toFormat(DATE_FORMAT)}
          isFlipped={true}
          uponClick={() => updateState(changeStartDate(1))}
        />
      </WeekDropForward>
    </DragDropContext>
  );
};

export default Planner;
