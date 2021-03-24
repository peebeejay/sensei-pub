import firebase from 'firebase/app';
import 'firebase/firestore';
import { Task } from '../types';
import { firebaseConfig } from '../secrets';

console.log('starting script');

firebase.initializeApp(firebaseConfig);
firebase.firestore();

const db = firebase.firestore();

/**
 * This script assigns a unique index value to all tasks for a given date. It is
 * intended to be run only once. But can be run multiple times if work is spread
 * over multiple days.
 */
const runScript = async () => {
  const data = await db.collection('tasks').get();
  const tasks = (data.docs as firebase.firestore.QueryDocumentSnapshot<
    Task
  >[]).map((task) => ({ ...task.data(), id: task.id }));
  const uniqueDatesObj: { [key: string]: boolean } = {};

  for (const task of tasks) {
    if (!uniqueDatesObj[task.due_date]) {
      uniqueDatesObj[task.due_date] = true;
    }
  }

  const uniqueDates = Object.keys(uniqueDatesObj).sort();
  console.log('Unique Dates:');
  console.log(uniqueDates);

  for (const date of uniqueDates) {
    const selectedTasks: Task[] = tasks.filter((task) => task.created_on === date);
    console.log('\n');
    selectedTasks.forEach(async (task, i) => {
      await db.collection('tasks').doc(task.id).update({
        index: i,
      });
      console.log(`Updated task: ${task.id} on ${task.due_date} with index ${i}`);
    });
  }

  return data;
};

// runScript();
