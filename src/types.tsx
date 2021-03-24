export type Task = {
  id: string;
  is_complete: boolean;
  due_date: string;
  created_on: string;
  title: string;
  description: string;
  index: number;
};

export type FirebaseTask = Omit<Task, 'id'>;

export type Tasks = {
  [taskId: string]: Task;
};

export type TaskListData = {
  tasks: Tasks;
  loading: boolean;
};

export type Item = {
  id: string;
  content: string;
  is_complete: boolean;
};

export enum Keys {
  Enter = 'Enter',
  Escape = 'Escape',
  Meta = 'Meta',
  J = 'j',
  K = 'k',
}

export type Token = {
  email: string;
  exp: number;
  iat: number;
  iss: string;
  msg: string;
  sub: string;
};
