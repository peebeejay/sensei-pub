import { Task, Tasks } from './types';
import { DateTime } from 'luxon';

export const getItems = (count: number, offset: number = 0): Tasks => {
  const tasks: Tasks = {};
  const taskArray = Array.from({ length: count }, (_, k) => k).map(
    (k, i): Task => ({
      id: `item-${k + offset}`,
      is_complete: false,
      due_date: 'test',
      created_on: 'test',
      title: `"Simplicity is the ultimate sophistication"`,
      description: 'test description',
      index: i,
    }),
  );

  taskArray.forEach((task) => {
    tasks[task.id] = task;
  });

  return tasks;
};

export const getFirstDayOfThisWeek = () => DateTime.local().startOf('week');
