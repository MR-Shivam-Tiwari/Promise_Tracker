import React, { useState } from 'react';

const initialTasks = [
  { id: 1, title: 'Work out', time: '8:00 am', details: 'Exercise at the gym or go for a run', status: 'pending', completed: false },
  { id: 2, title: 'Design team meeting', time: '2:30 pm', details: 'Discuss project updates with the design team', status: 'done', completed: true },
  { id: 3, title: 'Hand off the project', time: '7:00 pm', details: 'Submit the final project deliverables', status: 'pending', completed: false },
  { id: 4, title: 'Read 5 pages of "Sprint"', time: '10:30 pm', details: 'Read the book "Sprint" by Jake Knapp', status: 'pending', completed: false },
];

const SubTask = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);

  const toggleTask = (id) => {
    setActiveTask(activeTask === id ? null : id);
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: task.status === 'pending' ? 'done' : 'pending' } : task
    ));
  };

  return (
    <div className="mx-10 mt-10">
      {tasks.map((task) => (
        <div key={task.id} className="mb-4">
          <div
            className="flex justify-between items-center p-4 bg-white rounded shadow cursor-pointer"
            onClick={() => toggleTask(task.id)}
          >
            <div className="flex items-center">
              <span
                className={`h-4 w-4 rounded-full mr-3 ${task.status === 'done' ? 'bg-green-600' : task.id === activeTask ? 'bg-purple-600' : 'bg-gray-300'}`}
              ></span>
              <span
                className={`text-lg ${task.status === 'done' ? 'line-through text-gray-500' : ''} cursor-pointer select-none`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded text-white ${task.status === 'done' ? 'bg-red-500' : 'bg-green-500'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompletion(task.id);
                }}
              >
                {task.status === 'done' ? 'Pending' : 'Done'}
              </button>
            </div>
          </div>
          {activeTask === task.id && (
            <div className="p-4 bg-purple-100 rounded shadow mt-2">
              <p>{task.details}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubTask;
