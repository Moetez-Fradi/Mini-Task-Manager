import { useEffect, useState } from 'react';
import { Navigate, redirect } from 'react-router-dom';
import { isAuthenticated, isAdminUser, parseJwt } from '../services/Auth';
import axios from 'axios';
import BASE_URL from '../services/baseUrl';

export default function Dashboard() {

    if (!isAuthenticated){
        redirect("/login");
    }    

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ 
        title: '', 
        description: '', 
        userId: '',
        priority: 'MEDIUM'
      });
      const [selectedStatuses, setSelectedStatuses] = useState({});
      const [adminStatus, setAdminStatus] = useState(false);

      useEffect(() => {
        const checkAdminStatus = async () => {
          const isAdmin = await isAdminUser();
          setAdminStatus(isAdmin);
        };
        
        checkAdminStatus();
      }, []);

const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'info';
      case 'MEDIUM': return 'primary';
      case 'HIGH': return 'warning';
      case 'CRITICAL': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'secondary'; // Gray - not started
      case 'IN_PROGRESS':
        return 'primary'; // Blue - in progress
      case 'DONE':
        return 'success'; // Green - completed
      case 'BLOCKED':
        return 'danger'; // Red - blocked/stopped
      default:
        return 'light text-dark'; // Default fallback
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("idToken");
        if (!token) {
          setError('Not authenticated');
          return;
        }
          const decodedToken = parseJwt(token);
        const userEmail = decodedToken?.email;
  
        if (!userEmail) {
          setError('Could not identify user');
          return;
        }
  
        const response = await axios.get(`${BASE_URL}/tasks`);
        let filteredTasks = response.data;
  
        console.log(filteredTasks)
      
        if (!adminStatus) {
          filteredTasks = filteredTasks.filter(task => task.user.email === userEmail);
        }
  
        setTasks(filteredTasks);
        const initialStatuses = {}
        filteredTasks.forEach(element => {
          initialStatuses[element.id] = element.status;
        });
        setSelectedStatuses(initialStatuses)

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
  
    if (isAuthenticated()) {
      fetchTasks();
    }
  }, [adminStatus]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${BASE_URL}/tasks`, {
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            userEmail: newTask.userId
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("idToken")}`
            }
          });
            setTasks([...tasks, response.data]);
            setNewTask({ title: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('idToken')}`
                    }
                });
                setTasks(tasks.filter(task => task.id !== taskId));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete task');
            }
        }
    };

    const handlePartialUpdate = async (taskId, newStatus) => {
      try {
        const response = await axios.patch(
          `${BASE_URL}/tasks/${taskId}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('idToken')}`
            }
          }
        );
        
        setTasks(tasks.map(task => 
          task.id === taskId ? response.data : task
        ));
        setSelectedStatuses(prev => ({
          ...prev,
          [taskId]: undefined 
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update status');
      }
    };

    const handleUpdateTask = async (taskId, updatedData) => {
      try {
        const payload = {};
        
        if (updatedData.title !== undefined) {
          payload.title = updatedData.title === '' ? null : updatedData.title;
        }
        if (updatedData.description !== undefined) {
          payload.description = updatedData.description === '' ? null : updatedData.description;
        }
        if (updatedData.status !== undefined) {
          payload.status = updatedData.status;
        }
        if (updatedData.email !== undefined) {
          payload.userEmail = updatedData.email === '' ? null : updatedData.email;
        }
    
        const response = await axios.patch(
          `${BASE_URL}/tasks/pannel/${taskId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('idToken')}`
            }
          }
        );
            setTasks(tasks.map(task => 
          task.id === taskId ? response.data : task
        ));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update task');
      }
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }  

    return (
        <div>
  <div className="container mt-4">
    <h2>Dashboard</h2>
    {adminStatus ?  (
      <div className="admin-panel card mb-4">
        <div className="card-body">
          <h4 className="card-title">Admin Panel</h4>
          <form onSubmit={handleCreateTask}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => {
                  setNewTask({ ...newTask, title: e.target.value })
                }}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={newTask.userId || ''}
                onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <select 
                className="form-select"
                value={newTask.priority || 'medium'}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                required
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </form>
        </div>
      </div>
    ) : <h2>Not Admin</h2>}

    {error && <div className="alert alert-danger">{error}</div>}

    {loading ? (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      <div className="task-list">
        <h4>Tasks</h4>
        <div className="row">
        {tasks.map(task => (
    <div key={task?.id || Math.random()} className="col-md-4 mb-3">
      <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{task?.title || "New Task"}</h5>
                  <p className="card-text">{task?.description}</p>
                  <div className="task-meta mb-2">
                  <small className="text-muted d-block">
  user email: {task?.user?.email || 'Unassigned'}
</small>                    <small className={`badge bg-${getPriorityBadgeColor(task?.priority || "MEDIUM")}`}>
                      Priority: {task?.priority || 'MEDIUM'}
                      </small>
                      <br />
                      <small className={`badge bg-${getStatusBadgeColor(task?.status || "TODO")}`}>
                      status : {task?.status || 'unkown'}
                    </small>
                  </div>
                  {adminStatus ? (
                    <div className="admin-controls">
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleUpdateTask(task.id, {
                          ...newTask,
                          status: 'UPDATED'
                        })}
                      >
                        Update
                      </button>
                    </div>
                  ) :<> <select 
          className="form-select"
          value={selectedStatuses[task.id] || task.status}
          onChange={(e) => setSelectedStatuses(prev => ({
            ...prev,
            [task.id]: e.target.value
          }))}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="BLOCKED">Blocked</option>
        </select>
        <button
          className="btn btn-sm btn-warning mt-2"
          onClick={() => handlePartialUpdate(task.id, selectedStatuses[task.id] || task.status)}
        >
          Update Status
        </button></>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
    );
}