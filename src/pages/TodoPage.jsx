import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TickItLogo from '../assets/TickItLogo.svg';
import NoTask from '../assets/NoTask.svg';
import { useApiClient } from '../api/api';
import { useAuth } from '../context/AuthContext';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TodoItem = ({ todo, onUpdate, onDelete }) => {
    const { put, del } = useApiClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(todo.title);
    const [editedDescription, setEditedDescription] = useState(todo.description);
    const [editedDeadline, setEditedDeadline] = useState(todo.deadline ? todo.deadline.split('T')[0] : '');
    const [editedProjectName, setEditedProjectName] = useState(todo.project_name || '');

    const handleToggleComplete = async () => {
        try {
            const updatedTodo = await put(`/todos/${todo.id}`, { completed: !todo.completed });
            onUpdate(updatedTodo);
        } catch (error) {
            alert(`Failed to update todo status: ${error.message}`);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedTitle(todo.title);
        setEditedDescription(todo.description);
        setEditedDeadline(todo.deadline ? todo.deadline.split('T')[0] : '');
        setEditedProjectName(todo.project_name || '');
    };

    const handleSaveClick = async () => {
         if (!editedTitle) {
             alert('Title cannot be empty');
             return;
         }
         if (editedDeadline && !/^\d{4}-\d{2}-\d{2}$/.test(editedDeadline)) {
             alert('Invalid deadline format. Please useYYYY-MM-DD.');
             return;
         }

        const updateData = {
            title: editedTitle,
            description: editedDescription,
            deadline: editedDeadline || null,
            project_name: editedProjectName || null,
        };

        try {
            const updatedTodo = await put(`/todos/${todo.id}`, updateData);
            onUpdate(updatedTodo);
            setIsEditing(false);
        } catch (error) {
             alert(`Failed to update todo: ${error.details || error.message}`);
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
            try {
                await del(`/todos/${todo.id}`);
                onDelete(todo.id);
            } catch (error) {
                alert(`Failed to delete todo: ${error.message}`);
            }
        }
    };

    return (
        <div className={`bg-white p-4 rounded-md shadow mb-3 border ${todo.completed ? 'border-green-500' : 'border-blue-200'}`}>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                        placeholder="Title"
                    />
                    <textarea
                        value={editedDescription || ''}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                        placeholder="Description (optional)"
                        rows="2"
                    />
                     <div className="flex flex-col md:flex-row md:space-x-4">
                         <div className="w-full md:w-1/2 mb-2 md:mb-0">
                             <label className="block text-sm font-semibold text-gray-600 mb-1">Deadline:</label>
                              <input
                                type="date"
                                value={editedDeadline}
                                onChange={(e) => setEditedDeadline(e.target.value)}
                                className="w-full p-2 border rounded"
                              />
                         </div>
                         <div className="w-full md:w-1/2">
                              <label className="block text-sm font-semibold text-gray-600 mb-1">Project:</label>
                               <input
                                 type="text"
                                 value={editedProjectName}
                                 onChange={(e) => setEditedProjectName(e.target.value)}
                                 className="w-full p-2 border rounded"
                                 placeholder="Project Name (optional)"
                               />
                         </div>
                     </div>
                    <div className="mt-3 flex space-x-2 justify-end">
                        <button onClick={handleSaveClick} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">Save</button>
                        <button onClick={handleCancelClick} className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-start">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={handleToggleComplete}
                            className="mr-3 mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="flex-grow">
                            <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{todo.title}</h3>
                            {todo.description && <p className="text-gray-600 text-sm mt-1">{todo.description}</p>}
                            {(todo.deadline || todo.project_name) && (
                                 <div className="text-xs text-gray-500 mt-2">
                                     {todo.deadline && <span>Deadline: {new Date(todo.deadline).toLocaleDateString()}</span>}
                                     {todo.deadline && todo.project_name && <span className="mx-2">|</span>}
                                     {todo.project_name && <span>Project: {todo.project_name}</span>}
                                 </div>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-2 ml-4 flex-shrink-0">
                        <button onClick={handleEditClick} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                        <button onClick={handleDeleteClick} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};


function TodoPage() {
    const { isAuthenticated, logout } = useAuth();
    const { get, post, put, del } = useApiClient();

    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [newTodoDeadline, setNewTodoDeadline] = useState('');
    const [selectedProjectName, setSelectedProjectName] = useState('');
    const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
    const [newProjectNameInput, setNewProjectNameInput] = useState('');

    const [filterProject, setFilterProject] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [projectNames, setProjectNames] = useState([]);

    const [stats, setStats] = useState(null);

    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedTodos = await get('/todos', { sortBy, project: filterProject });
            setTodos(fetchedTodos);
        } catch (err) {
            setError('Failed to fetch todos.');
            console.error('Fetch Todos Error:', err);
        } finally {
            setLoading(false);
        }
    };

     const fetchProjectNames = async () => {
         try {
             const uniqueNames = [...new Set(todos.map(todo => todo.project_name).filter(name => name))].sort();
             setProjectNames(uniqueNames);
         } catch (err) {
             console.error('Failed to fetch project names:', err);
         }
     }

     const fetchStats = async () => {
         try {
             const fetchedStats = await get('/users/stats/todos');
             setStats(fetchedStats);
         } catch (err) {
             console.error('Failed to fetch stats:', err);
         }
     }

    useEffect(() => {
        fetchTodos();
        fetchStats();
    }, [filterProject, sortBy]);

    useEffect(() => {
        fetchProjectNames();
    }, [todos]);

    const handleCreateTodo = async (e) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) {
            alert('Title cannot be empty.');
            return;
        }

        let finalProjectName = null;
        if (isCreatingNewProject) {
            finalProjectName = newProjectNameInput.trim();
            if (!finalProjectName) {
                 alert('New project name cannot be empty.');
                 return;
            }
        } else if (selectedProjectName) {
            finalProjectName = selectedProjectName;
        }

        setLoading(true);
        setError(null);

        const deadline = newTodoDeadline ? newTodoDeadline : null;

        try {
            const newTodo = await post('/todos', {
                title: newTodoTitle.trim(),
                description: newTodoDescription.trim(),
                deadline,
                project_name: finalProjectName,
            });

            setTodos([newTodo, ...todos]);
            setNewTodoTitle('');
            setNewTodoDescription('');
            setNewTodoDeadline('');
            setSelectedProjectName('');
            setIsCreatingNewProject(false);
            setNewProjectNameInput('');

            fetchStats();

        } catch (err) {
            setError('Failed to create todo.');
            console.error('Create Todo Error:', err);
            alert(`Failed to create todo: ${err.details || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSelectChange = (e) => {
        const value = e.target.value;
        if (value === 'CREATE_NEW_PROJECT') {
            setIsCreatingNewProject(true);
            setSelectedProjectName('');
        } else {
            setIsCreatingNewProject(false);
            setSelectedProjectName(value);
            setNewProjectNameInput('');
        }
    };

    const handleUpdateTodo = (updatedTodo) => {
        setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
        fetchStats();
    };

    const handleDeleteTodo = (deletedTodoId) => {
        setTodos(todos.filter(todo => todo.id !== deletedTodoId));
        fetchStats();
    };

    const handleFilterProjectChange = (e) => {
        setFilterProject(e.target.value);
    };

    const handleSortByChange = (e) => {
         setSortBy(e.target.value);
    };

    const handleUpdateProject = async () => {
         const oldName = prompt("Enter the current project name to update:");
         if (!oldName) return;
         const newName = prompt(`Enter the new name for project "${oldName}":`);
         if (!newName || !newName.trim()) {
              alert("New project name cannot be empty.");
              return;
         }

         try {
              const result = await put(`/todos/projects/${oldName}`, { newProjectName: newName.trim() });
              alert(`Successfully updated ${result.updatedCount} tasks from "${oldName}" to "${newName.trim()}".`);
              fetchTodos();
              fetchProjectNames();
         } catch (error) {
              alert(`Failed to update project name: ${error.details || error.message}`);
         }
    };

     const handleDeleteProject = async () => {
         const projectNameToDelete = prompt("Enter the project name to remove (tasks will NOT be deleted, only lose their project name):");
         if (!projectNameToDelete || !projectNameToDelete.trim()) {
              alert("Project name is required.");
              return;
         }

         if (window.confirm(`Are you sure you want to remove project association for tasks in "${projectNameToDelete.trim()}"? Their project name will be set to NONE.`)) {
             try {
                  const result = await del(`/todos/projects/${projectNameToDelete.trim()}`);
                  alert(`Successfully removed project "${projectNameToDelete.trim()}" association from ${result.updatedCount} tasks.`);
                  fetchTodos();
                  fetchProjectNames();
             } catch (error) {
                  alert(`Failed to remove project association: ${error.details || error.message}`);
             }
         }
     };

     const handleClearCompleted = async () => {
         if (window.confirm("Are you sure you want to delete ALL completed tasks?")) {
             try {
                 const result = await del('/todos/completed');
                 alert(`Successfully deleted ${result.deletedCount} completed tasks.`);
                 fetchTodos();
                 fetchStats();
             } catch (error) {
                  alert(`Failed to clear completed tasks: ${error.details || error.message}`);
             }
         }
     };

    const chartData = stats && stats.total > 0 ? {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            data: [stats.completed, stats.pending],
            backgroundColor: [
              '#10B981',
              '#60A5FA',
            ],
            borderColor: [
              '#ffffff',
              '#ffffff',
            ],
            borderWidth: 2,
          },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Task Status Overview',
            font: {
                size: 16,
                weight: 'bold',
            },
             color: '#374151',
          },
           tooltip: {
               callbacks: {
                   label: function(context) {
                       const label = context.label || '';
                       const value = context.raw;
                       const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                       const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                       return `${label}: ${value} (${percentage}%)`;
                   }
               }
           }
        },
    };

    return (
        <div className="min-h-screen bg-gray-100">
             <nav className="container mx-auto px-4 py-4 flex items-center justify-between bg-white shadow-sm">
                 <Link to="/app" className="flex items-center">
                      <img src={TickItLogo} alt="TickIt Logo" className="h-8 mr-2" />
                      <span className="text-2xl font-bold text-gray-800">TickIt</span>
                 </Link>
                 <div className="flex items-center space-x-4">
                     <button
                       onClick={logout}
                       className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                     >
                       Logout
                     </button>
                 </div>
             </nav>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h1>

                {stats && (
                    <div className="bg-white p-6 rounded-md shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col justify-center text-center md:text-left">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Status</h2>
                            <div className="flex justify-around md:justify-start md:space-x-8 mb-6">
                                 <div className="flex flex-col items-center md:items-start">
                                     <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                     <div className="text-sm text-gray-600">Total Tasks</div>
                                 </div>
                                 <div className="flex flex-col items-center md:items-start">
                                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                                      <div className="text-sm text-gray-600">Completed</div>
                                 </div>
                                 <div className="flex flex-col items-center md:items-start">
                                      <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
                                      <div className="text-sm text-gray-600">Pending</div>
                                 </div>
                            </div>

                            {stats.total > 0 ? (
                                stats.pending === 0 ? (
                                     <div className="w-full h-48 bg-blue-200 rounded-md flex items-center justify-center text-blue-800 text-center text-lg font-semibold">
                                         <img src={NoTask} alt="No Task" className="h-8 mr-2" />
                                     </div>
                                ) : (
                                     <p className="text-gray-600">Keep going! You still have tasks to tick off.</p>
                                )
                            ) : (
                                 <p className="text-gray-600 text-center">You haven't added any tasks yet!</p>
                            )}

                        </div>

                         {stats.total > 0 && stats.pending > 0 && chartData && (
                             <div className="w-full h-64 flex justify-center items-center">
                                  <div style={{ position: 'relative', width: '100%', maxWidth: '300px', height: '300px' }}>
                                      <Pie data={chartData} options={chartOptions} />
                                  </div>
                             </div>
                         )}
                    </div>
                )}

                <div className="bg-white p-6 rounded-md shadow mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
                    <form onSubmit={handleCreateTodo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="title"
                                value={newTodoTitle}
                                onChange={(e) => setNewTodoTitle(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Task title"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                value={newTodoDescription}
                                onChange={(e) => setNewTodoDescription(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Task description (optional)"
                                rows="2"
                            />
                        </div>
                         <div>
                             <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
                             <input
                                 type="date"
                                 id="deadline"
                                 value={newTodoDeadline}
                                 onChange={(e) => setNewTodoDeadline(e.target.value)}
                                 className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                             />
                         </div>
                         <div>
                              <label htmlFor="project_name" className="block text-sm font-semibold text-gray-700 mb-1">Project</label>
                              <select
                                 id="project_name"
                                 value={isCreatingNewProject ? 'CREATE_NEW_PROJECT' : selectedProjectName}
                                 onChange={handleProjectSelectChange}
                                 className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                              >
                                  <option value="">No Project</option>
                                  {projectNames.map(name => (
                                      <option key={name} value={name}>{name}</option>
                                  ))}
                                   <option value="CREATE_NEW_PROJECT">--- Create New Project ---</option>
                              </select>
                         </div>
                         {isCreatingNewProject && (
                             <div className="md:col-span-2 -mt-2 mb-2">
                                <label htmlFor="new_project_name" className="block text-sm font-semibold text-gray-700 mb-1">New Project Name:</label>
                                <input
                                    type="text"
                                    id="new_project_name"
                                    value={newProjectNameInput}
                                    onChange={(e) => setNewProjectNameInput(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                    placeholder="Enter new project name"
                                    required
                                />
                             </div>
                         )}
                        <div className={`md:col-span-2 ${isCreatingNewProject ? '-mt-2' : ''}`}>
                            <button
                                type="submit"
                                className={`w-full bg-tickitGreen-500 hover:bg-tickitGreen-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Adding Task...' : 'Add Task'}
                            </button>
                        </div>
                        {error && <p className="md:col-span-2 text-red-500 text-center">{error}</p>}
                    </form>
                </div>

                <div className="bg-white p-6 rounded-md shadow mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/3">
                         <label htmlFor="filterProject" className="block text-sm font-semibold text-gray-700 mb-1">Filter by Project:</label>
                         <select
                            id="filterProject"
                            value={filterProject}
                            onChange={handleFilterProjectChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                         >
                             <option value="">All Projects</option>
                             {projectNames.map(name => (
                                 <option key={name} value={name}>{name}</option>
                             ))}
                         </select>
                    </div>
                    <div className="w-full md:w-1/3">
                         <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-1">Sort By:</label>
                         <select
                            id="sortBy"
                            value={sortBy}
                            onChange={handleSortByChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                         >
                             <option value="">Recent</option>
                             <option value="deadline">Deadline</option>
                             <option value="project">Project</option>
                         </select>
                    </div>
                     <div className="w-full md:w-1/3 flex flex-col space-y-2 md:space-y-0 md:space-x-2 md:flex-row justify-end">
                         <button onClick={handleUpdateProject} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded transition duration-300 w-full md:w-auto">Edit Project Name</button>
                         <button onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded transition duration-300 w-full md:w-auto">Remove Project</button>
                     </div>
                </div>

                <div className="text-right mb-6">
                     <button onClick={handleClearCompleted} className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded transition duration-300">Clear Completed Tasks</button>
                </div>

                {loading && <p className="text-center text-gray-600">Loading tasks...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && todos.length === 0 && (
                    <p className="text-center text-gray-600">No tasks found. Add one above!</p>
                )}
                {!loading && !error && todos.length > 0 && (
                    <div>
                        {todos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onUpdate={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodoPage;