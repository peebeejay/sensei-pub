import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { rem } from 'polished';
import { storiesOf } from '@storybook/react';
import { DateTime } from 'luxon';
import TaskList from '../components/TaskList';
import PlannerProvider from '../components/PlannerProvider';
import { Tasks, TaskListData } from '../types';
import { getItems } from '../utils';

const Container = styled.div`
  width: 14.2vw;
  margin: ${rem(15)};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

storiesOf('Task List', module).add('Single Task List', () => {
  return <TaskListStory />;
});

const TaskListStory = () => {
  const [taskData, setTasks] = useState<TaskListData>({
    tasks: getItems(5),
    loading: false,
  });

  const reorderItems = (list: Tasks, startIndex: number, endIndex: number) => {
    const newList = { ...list };
    // Until a solution for persisting order is found, this remains commented out.
    // const [removed] = newList.splice(startIndex, 1);
    // newList.splice(endIndex, 0, removed);

    return newList;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (destination) {
      const newItems = reorderItems(taskData.tasks, source.index, destination.index);
      setTasks({
        ...taskData,
        tasks: newItems,
      });
    }
  };

  return (
    <PlannerProvider>
      <Container>
        <DragDropContext onDragEnd={onDragEnd}>
          <TaskList
            listId="list-1"
            taskList={taskData}
            date={DateTime.fromISO('2020-05-22')}
          />
        </DragDropContext>
      </Container>
    </PlannerProvider>
  );
};
