import React, {
  FC,
  useState,
  createContext,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { DraggableLocation } from 'react-beautiful-dnd';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  State,
  Dispatcher,
  createInitialState,
  setLoadingState,
  toggleToast,
  setTasks,
  markComplete,
  addCreatedTask,
  moveItem as moveItemState,
} from './state';
import { Task, FirebaseTask } from '../../types';
import { TASKS, DATE_FORMAT } from '../../constants';
import { firebaseConfig } from '../../secrets';

type Props = {
  children: React.ReactNode;
};

export const PlannerDispatch = createContext<Dispatcher>({} as Dispatcher);
export const PlannerState = createContext<State>({} as State);

const PlannerProvider: FC<Props> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [state, updateState] = useState<State>(createInitialState(location));

  /* Initialize Firebase upon mounting this component & delete it upon unmount */
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    firebase
      .firestore()
      .enablePersistence()
      .catch(function () {
        console.warn('Failed to enable local persistence');
      });

    return () => {
      firebase.app().delete();
    };
  }, []);

  /**
   * This hook listens for changes in task data on firebase and updates the
   * client's state in realtime via grpc 🏃‍♀️.
   *
   * This function queries and listens for changes to task data that falls in the following
   * range:
   *   [- 1 week <-- [startdate, startDate + 6 days] --> + 1 week]
   */
  useEffect(() => {
    /*
     * This first call fetches data for all 3 weeks as detailed above.
     */
    fetchData();

    /*
     * This secondary call listens for changes only in the week currently viewable on the screen.
     * [startdate, startDate + 6 days]
     */
    const db = firebase.firestore();
    const endOfWeekDate = state.startDate.plus({ days: 6 }).toFormat(DATE_FORMAT);
    let unsubscribe: () => void;
    try {
      unsubscribe = db
        .collection(TASKS)
        .where('due_date', '>=', state.startDate.toFormat(DATE_FORMAT))
        .where('due_date', '<=', endOfWeekDate)
        .onSnapshot((querySnapshot) => {
          updateState(
            setTasks(
              querySnapshot.docs as firebase.firestore.QueryDocumentSnapshot<Task>[],
            ),
          );
        });
    } catch (e) {
      console.warn(e);
      updateState(toggleToast('Failed to realtime fetch data'));
    }

    return () => {
      unsubscribe();
    };
  }, [state.startDate]);

  /**
   * This hook is used to update the URL to the following format: /calendar/week/:year/:month/:day
   * whenever the startDate changes & on initial page load.
   */
  useEffect(() => {
    history.replace(
      `/calendar/week/${state.startDate.toFormat('yyyy')}/${state.startDate.toFormat(
        'MM',
      )}/${state.startDate.toFormat('dd')}`,
    );
  }, [state.startDate, history]);

  const fetchData = useCallback(async () => {
    const db = firebase.firestore();
    const firstDate = state.startDate.minus({ days: 7 }).toFormat(DATE_FORMAT);
    const endDate = state.startDate.plus({ days: 6, weeks: 1 }).toFormat(DATE_FORMAT);

    try {
      const snapshot = await db
        .collection(TASKS)
        .where('due_date', '>=', firstDate)
        .where('due_date', '<=', endDate)
        .get();
      updateState(
        setTasks(snapshot.docs as firebase.firestore.QueryDocumentSnapshot<Task>[]),
      );
    } catch (e) {
      console.warn(e);
      updateState(toggleToast('Failed to fetch data'));
    }
  }, [state.startDate]);

  const createTask = useCallback(
    async (
      title: string,
      description: string,
      dueDate: string,
      listId: string,
      index: number,
    ) => {
      const db = firebase.firestore();
      updateState(setLoadingState(listId, true));
      try {
        const newTask: FirebaseTask = {
          title,
          description,
          due_date: dueDate,
          created_on: dueDate,
          is_complete: false,
          index,
        };

        const docRef = await db.collection(TASKS).add(newTask);
        const taskId = docRef.id;

        updateState(
          addCreatedTask({
            ...newTask,
            id: taskId,
          }),
        );
        updateState(toggleToast('Task created'));
        updateState(setLoadingState(listId, false));
      } catch (e) {
        console.warn(e);
        updateState(toggleToast('Failed to create task'));
      }
    },
    [],
  );

  const markTaskComplete = useCallback(
    async (taskId: string, listId: string) => {
      const db = firebase.firestore();
      try {
        const currentStatus = state.tasks[listId].tasks[taskId].is_complete;
        updateState(markComplete(taskId, listId));
        await db.collection(TASKS).doc(taskId).update({
          is_complete: !currentStatus,
        });
      } catch (e) {
        console.warn(e);
        updateState(toggleToast('Failed to mark task status'));
      }
    },
    [state],
  );

  const moveItem = useCallback(
    async (source: DraggableLocation, destination: DraggableLocation, taskId: string) => {
      const db = firebase.firestore();
      try {
        updateState(moveItemState(source, destination, taskId));
        await db.collection(TASKS).doc(taskId).update({
          due_date: destination.droppableId,
        });
      } catch (e) {
        console.warn(e);
        updateState(toggleToast('Failed to move task'));
      }
    },
    [],
  );

  const deleteItem = useCallback(async (taskId: string) => {
    const db = firebase.firestore();
    try {
      await db.collection(TASKS).doc(taskId).delete();
      updateState(toggleToast('Task deleted'));
    } catch (e) {
      console.warn(e);
      updateState(toggleToast('Failed to delete task'));
    }
  }, []);

  const updateTask = useCallback(async (task: Task) => {
    const db = firebase.firestore();
    try {
      await db.collection(TASKS).doc(task.id).update({
        title: task.title,
        description: task.title,
        // Eventually can put date here
      });
      updateState(toggleToast('Task updated'));
    } catch (e) {
      console.warn(e);
      updateState(toggleToast('Failed to update task'));
    }
  }, []);

  const dispatcher = useMemo(() => {
    return {
      updateState,
      createTask,
      markTaskComplete,
      moveItem,
      deleteItem,
      updateTask,
    };
  }, [createTask, markTaskComplete, moveItem]);

  return (
    <PlannerDispatch.Provider value={dispatcher}>
      <PlannerState.Provider value={state}>{props.children}</PlannerState.Provider>
    </PlannerDispatch.Provider>
  );
};

export default PlannerProvider;
