import React, { useState, useEffect } from 'react';
import taskService from './services/taskService';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 2 });
  const [sortBy, setSortBy] = useState('created');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend. Make sure it\'s running on port 8080.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const newTask = await taskService.createTask({
        ...formData,
        completed: false
      });
      setTasks([newTask, ...tasks]);
      setFormData({ title: '', description: '', priority: 2 });
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updated = await taskService.updateTask(task.id, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and search
  let filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'pending' && !task.completed);
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Sort
  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') return b.priority - a.priority;
    if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 3 && !t.completed).length
  };

  const priorityColors = {
    1: { bg: '#e8f5e9', text: '#2e7d32', label: 'Low', border: '#81c784' },
    2: { bg: '#fff3e0', text: '#e65100', label: 'Medium', border: '#ffb74d' },
    3: { bg: '#ffebee', text: '#c62828', label: 'High', border: '#e57373' }
  };

  return (
    <div className="app-container">
      {/* Background Effects */}
      <div className="bg-gradient"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">✓</div>
            <h1>TaskFlow</h1>
            <p>Organize. Prioritize. Execute.</p>
          </div>

          <div className="header-search">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>

          <button 
            className={`btn-new-task ${showForm ? 'active' : ''}`}
            onClick={() => setShowForm(!showForm)}
          >
            <span className="plus-icon">+</span>
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="stats-dashboard">
        <div className="stat-card stat-total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
          <div className="stat-bar"></div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">To Do</div>
          <div className="stat-bar"></div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Done</div>
          <div className="stat-bar"></div>
        </div>
        <div className="stat-card stat-priority">
          <div className="stat-value">{stats.highPriority}</div>
          <div className="stat-label">Urgent</div>
          <div className="stat-bar"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Add Task Form */}
        {showForm && (
          <form className="add-task-form" onSubmit={handleAddTask}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Task title..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Add description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-textarea"
              />
            </div>
            <div className="form-row">
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                className="form-select"
              >
                <option value={1}>🟢 Low Priority</option>
                <option value={2}>🟡 Medium Priority</option>
                <option value={3}>🔴 High Priority</option>
              </select>
              <button type="submit" className="btn-submit">Create Task</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Filters and Sort */}
        <div className="controls-section">
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              To Do
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Done
            </button>
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="created">Newest First</option>
            <option value="priority">By Priority</option>
            <option value="name">A - Z</option>
          </select>
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>
                {filter === 'all' ? 'No tasks yet' : 
                 filter === 'completed' ? 'No completed tasks' : 
                 'All caught up!'}
              </h3>
              <p>
                {filter === 'all' ? 'Create your first task to get started' : 
                 filter === 'completed' ? 'Complete some tasks to see them here' : 
                 'No pending tasks. Great job!'}
              </p>
            </div>
          )}

          <ul className="tasks-list">
            {filteredTasks.map((task, index) => (
              <li key={task.id} className="task-item" style={{'--index': index}}>
                <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                </div>

                <div className="task-content">
                  <div className="task-header">
                    <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
                      {task.title}
                    </h4>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: priorityColors[task.priority].bg,
                        color: priorityColors[task.priority].text,
                        borderColor: priorityColors[task.priority].border
                      }}
                    >
                      {priorityColors[task.priority].label}
                    </span>
                  </div>
                  {task.description && (
                    <p className={`task-description ${task.completed ? 'completed' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="task-meta">
                    <span className="task-date">
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-delete"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
