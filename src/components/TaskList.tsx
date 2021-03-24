import React, { FC } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DateTime } from 'luxon';
import { TaskListData } from '../types';
import TaskCard from './TaskCard';
import AddTask from './AddTask';
import DayHeader from './DayHeader';
import { DATE_FORMAT } from '../constants';
import { noctisAzureus } from '../theme';

type Props = {
  listId: string;
  taskList: TaskListData;
  date: DateTime;
};

const GRID = 8;

export const List = styled.div`
  flex: 1;
  transition: background 400ms ease;
  padding: ${rem(GRID)};
  padding-bottom: 0;
  min-height: 65vh;
  max-height: 85vh;
  overflow-y: scroll;
`;

export const ListContainer = styled.div<{
  isDraggingOver: boolean;
  isWeekend: boolean;
}>`
  flex: 1;
  background: ${(props) =>
    props.isWeekend ? noctisAzureus.planner.bgWeekend : noctisAzureus.planner.bg};
  transition: background 400ms ease;
`;

const TaskList: FC<Props> = (props) => {
  const {
    listId,
    taskList: { tasks, loading },
    date,
  } = props;
  const isWeekend = ['6', '7'].includes(date.toFormat('c'));

  const sortedTaskIds = React.useMemo(
    () =>
      Object.keys(tasks).sort((a, b) => {
        if (tasks[a].index < tasks[b].index) {
          return -1;
        }
        if (tasks[a].index > tasks[b].index) {
          return 1;
        }

        return 0;
      }),
    [tasks],
  );

  return (
    <Droppable droppableId={listId}>
      {(provided, snapshot) => (
        <ListContainer isWeekend={isWeekend} isDraggingOver={snapshot.isDraggingOver}>
          <DayHeader date={date} isDraggingOver={snapshot.isDraggingOver} />
          <List ref={provided.innerRef}>
            {sortedTaskIds.map((taskId, index) => (
              <Draggable
                key={tasks[taskId].id}
                draggableId={tasks[taskId].id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={tasks[taskId]}
                      isDragging={snapshot.isDragging}
                      listId={listId}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <AddTask
              listId={listId}
              loading={loading}
              date={date.toFormat(DATE_FORMAT)}
              size={sortedTaskIds.length}
            />
          </List>
        </ListContainer>
      )}
    </Droppable>
  );
};

export default TaskList;
