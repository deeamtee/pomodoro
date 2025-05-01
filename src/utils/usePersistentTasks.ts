import { useEffect, useRef, useState } from 'react';
import { Task } from '../types';

const TASKS_STORAGE_KEY = 'pomodoro_tasks_v1';

function getDeviceStorage(): any {
  // @ts-expect-error
  return window.Telegram?.WebApp?.deviceStorage;
}

async function saveTasksToStorage(tasks: Task[]) {
  const deviceStorage = getDeviceStorage();
  const data = tasks.map(t => ({ ...t, createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt }));
  if (deviceStorage && typeof deviceStorage.setItem === 'function') {
    try {
      await deviceStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data));
      return;
    } catch {
      // fallback
    }
  }
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

async function loadTasksFromStorage(): Promise<Task[]> {
  const deviceStorage = getDeviceStorage();
  if (deviceStorage && typeof deviceStorage.getItem === 'function') {
    try {
      const str = await deviceStorage.getItem(TASKS_STORAGE_KEY);
      if (str) {
        return JSON.parse(str).map((t: Omit<Task, 'createdAt'> & { createdAt: string }) => ({ ...t, createdAt: new Date(t.createdAt) }));
      }
    } catch {
      // fallback
    }
  }
  try {
    const str = localStorage.getItem(TASKS_STORAGE_KEY);
    if (str) {
      return JSON.parse(str).map((t: Omit<Task, 'createdAt'> & { createdAt: string }) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
  } catch {
    // ignore
  }
  return [];
}

export function usePersistentTasks(initial: Task[] = []): [Task[], (updater: Task[] | ((prev: Task[]) => Task[])) => void] {
  const [tasks, setTasksState] = useState<Task[]>(initial);
  const isFirstLoad = useRef(true);

  // Загрузка задач при инициализации
  useEffect(() => {
    loadTasksFromStorage().then(loaded => {
      if (loaded.length > 0) {
        setTasksState(loaded);
      }
      isFirstLoad.current = false;
    });
    // eslint-disable-next-line
  }, []);

  // Сохранять задачи при изменении (но не при первом рендере)
  useEffect(() => {
    if (!isFirstLoad.current) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  // Аналог setState: поддержка функции и значения
  const setTasks = (updater: Task[] | ((prev: Task[]) => Task[])) => {
    setTasksState(prev => typeof updater === 'function' ? (updater as (prev: Task[]) => Task[])(prev) : updater);
  };

  return [tasks, setTasks];
}
