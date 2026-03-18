import React from 'react';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const handleToggle = () => {
    onUpdate(task.id, { ...task, completed: !task.completed });
  };

  const priorityColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  };

  const priorityLabels = {
    1: 'Low',
    2: 'Medium',
    3: 'High'
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      task.completed ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'
    } shadow-sm hover:shadow-md transition-shadow`}>
      
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="w-5 h-5 mr-4 cursor-pointer"
        />
        
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
