import React, { useState } from 'react';
import { Plus, Check, Trash, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';

const TaskList: React.FC = () => {
  const { tasks, addTask, toggleTaskCompletion, deleteTask, appSettings } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    addTask(newTaskTitle);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tasks</h2>
        
        {!isAddingTask && (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center text-sm pr-2 rounded-full transition-colors"
            style={{ color: appSettings.theme }}
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {isAddingTask && (
        <div className="flex items-center mb-4 space-x-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you working on?"
            className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            style={{ focusRing: appSettings.theme }}
            autoFocus
          />
          <button
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            className="p-2 rounded-lg text-white text-sm"
            style={{ 
              backgroundColor: newTaskTitle.trim() ? appSettings.theme : 'rgba(156, 163, 175, 0.5)'
            }}
          >
            Add
          </button>
          <button
            onClick={() => setIsAddingTask(false)}
            className="p-2 rounded-lg bg-gray-200 text-gray-600 text-sm dark:bg-gray-700 dark:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length === 0 && !isAddingTask ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm pb-4">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTaskCompletion} 
              onDelete={deleteTask}
              themeColor={appSettings.theme}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, themeColor }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 flex items-center justify-center rounded-full border transition-colors ${
            task.completed 
              ? 'bg-opacity-90 border-transparent' 
              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
          }`}
          style={{ 
            backgroundColor: task.completed ? themeColor : undefined 
          }}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <Check size={12} color="white" />}
        </button>
        
        <span className={`text-sm ${
          task.completed 
            ? 'line-through text-gray-500 dark:text-gray-400' 
            : 'text-gray-800 dark:text-gray-200'
        }`}>
          {task.title}
        </span>
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Delete task"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};

export default TaskList;