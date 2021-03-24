import { Dispatch, SetStateAction } from 'react';
import { DraggableLocation } from 'react-beautiful-dnd';
import { Location } from 'history';
import { DateTime } from 'luxon';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { TaskListData, Task, Tasks } from '../../types';
import { DATE_FORMAT, DAYS_IN_WEEK } from '../../constants';
import { generateDateKeys } from './utils';
import { getFirstDayOfThisWeek } from '../../utils';

export type State = {
  tasks: {
    [listId: string]: TaskListData;
  };
  startDate: DateTime;
  toastMessage: string;
  disableGlobalHotKeys: boolean;
};

export interface Dispatcher {
  updateState: Dispatch<SetStateAction<State>>;
  createTask: (
    title: string,
    description: string,
    dueDate: string,
    listId: string,
    index: number,
  ) => void;
  markTaskComplete: (taskId: string, listId: string) => void;
  moveItem: (
    source: DraggableLocation,
    destination: DraggableLocation,
    taskId: string,
  ) => void;
  deleteItem: (taskId: string) => void;
  updateTask: (task: Task) => void;
}

export type Updater<P = void> = (p: P) => (state: State) => State;
export type Updater2<P1, P2> = (p1: P1, p2: P2) => (state: State) => State;
export type Updater3<P1, P2, P3> = (p1: P1, p2: P2, p3: P3) => (state: State) => State;

/**
 * A function to generate the initial default state prior to any API calls.
 */
export const createInitialState = (location: Location): State => {
  /**
   * This segment of code checks whether the URL is correctly parsable as a date, specifically in the format as
   * denoted by the regex ~ /calendar/week/:year/:month/:day
   *
   * If it isn't parsable and results in an invalid DateTime object, the startDate is defaulted to
   * the first day of the current week
   */
  let startDate = DateTime.local().startOf('week');
  if (/\/calendar\/week\/[0-9]+\/[0-9]+\/[0-9]+/g.test(location.pathname)) {
    const params: string[] = location.pathname.split('/');
    const year = params[3];
    const month = params[4];
    const day = params[5];

    startDate = DateTime.fromISO(`${year}-${month}-${day}`).startOf('week');

    if (!startDate.isValid) {
      startDate = DateTime.local().startOf('week');
    }
  }

  const state: State = {
    startDate: startDate,
    toastMessage: '',
    disableGlobalHotKeys: false,
    tasks: {},
  };

  /* This function generates data for 3 weeks (21 days). */
  const dates = [...Array(DAYS_IN_WEEK * 3).keys()].map((i) =>
    startDate.minus({ days: 7 }).plus({ days: i }).toFormat(DATE_FORMAT),
  );

  dates.forEach((key) => {
    state.tasks[key] = { tasks: {}, loading: false };
  });

  return state;
};

/**
 * If the item is moved within the same list, then only manipulate the
 * copied sourceList instead of transferring to a new list. In this case, both destination.droppableId and
 * source.droppableId will be the same, with the newSourceList remaining dominant in the returned object
 *
 * If on the other hand, the item is being moved from one list to another, then splice the element into the
 * newDestinationList and update state accordingly
 */
export const moveItem: Updater3<DraggableLocation, DraggableLocation, string> = (
  source,
  destination,
  taskId,
) => (state: State) => {
  const newSourceList = { ...state.tasks[source.droppableId].tasks };
  // Deal with the situation where a task is moved between weeks
  const newDestinationList: Tasks = !state.tasks[destination.droppableId]
    ? {}
    : { ...state.tasks[destination.droppableId].tasks };
  const task = { ...newSourceList[taskId] };

  delete newSourceList[taskId];
  newDestinationList[taskId] = task;

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [source.droppableId]: {
        ...state.tasks[source.droppableId],
        tasks: newSourceList,
      },
      [destination.droppableId]: {
        ...state.tasks[destination.droppableId],
        tasks: newDestinationList,
      },
    },
  };
};

/**
 * This function is used to mark a task as complete
 */
export const markComplete: Updater2<string, string> = (taskId, listId) => (
  state: State,
) => {
  const newState = { ...state };
  const task = { ...newState.tasks[listId].tasks[taskId] };
  task.is_complete = !task.is_complete;
  newState.tasks[listId].tasks[taskId] = task;

  return newState;
};

/**
 * This function is used to set the loading state for a particular list of tasks
 */
export const setLoadingState: Updater2<string, boolean> = (listId, loading) => (
  state: State,
) => {
  const newState = { ...state };
  newState.tasks[listId].loading = loading;

  return newState;
};

/**
 * This function is used to set toast messages. For example, on an API failure, an error toast
 * would be set.
 */
export const toggleToast: Updater<string> = (message) => (state: State) => ({
  ...state,
  toastMessage: message,
});

/**
 * This function adds a newly created task to the appropriate task list in state.
 */
export const addCreatedTask: Updater<Task> = (task: Task) => (state: State) => {
  return {
    ...state,
    tasks: {
      ...state.tasks,
      [task.created_on]: {
        ...state.tasks[task.created_on],
        tasks: {
          ...state.tasks[task.created_on].tasks,
          [task.id]: {
            ...task,
          },
        },
      },
    },
  };
};

/**
 * This function transforms task data received from firebase and folds it into state in discrete
 * object lists for each day.
 */
export const setTasks: Updater<firebase.firestore.QueryDocumentSnapshot<Task>[]> = (
  tasks,
) => (state: State) => {
  /**
   * Essentially generates a new empty task sub-state. I believe it was written
   * this way in order to facilitate adding and updating tasks & to sync with the backend.
   *
   * In this function, we clear out data for days of [startDate, startDate + 6] - it retains the
   * data from all other days.
   */
  const newTasks: State['tasks'] = Object.keys({ ...state.tasks }).reduce(
    (memo, listId: string) => ({
      ...memo,
      [listId]: {
        ...state.tasks[listId],
        tasks:
          DateTime.fromISO(listId) < state.startDate ||
          DateTime.fromISO(listId) > state.startDate.plus({ days: 6 })
            ? state.tasks[listId].tasks
            : {},
      },
    }),
    {},
  );

  return tasks
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .reduce(
      (memo, task) => {
        return {
          ...memo,
          tasks: {
            ...memo.tasks,
            [task.due_date]: {
              ...memo.tasks[task.due_date],
              loading: memo.tasks[task.due_date].loading,
              tasks: {
                ...memo.tasks[task.due_date].tasks,
                [task.id]: task,
              },
            },
          },
        };
      },
      // Initial Value --⬇️--
      {
        ...state,
        tasks: newTasks,
      },
    );
};

/**
 * This function shifts the startDate forward one week into the future, or back one week into the past
 */
export const changeStartDate: Updater<number> = (period) => (state: State) => {
  const newStartDate = state.startDate.plus({ weeks: period });

  return {
    ...state,
    tasks: {
      ...state.tasks,
      ...generateDateKeys(newStartDate, state),
    },
    startDate: newStartDate,
  };
};

/**
 * This function reverts startDate back to the **current** week
 */
export const revertStartDate: Updater = () => (state: State) => ({
  ...state,
  startDate: getFirstDayOfThisWeek(),
});

export const disableGlobalHotkeys: Updater<boolean> = (isDisabled) => (state: State) => ({
  ...state,
  disableGlobalHotKeys: isDisabled,
});
