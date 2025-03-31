import { useState } from 'react';
import './RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';
import BASE_URL from '../services/baseUrl';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    apiError: null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      password: !formData.password.trim(),
      apiError: null
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log('Registration successful:', response.data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        apiError: error.response?.data?.message || 'Registration failed. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="registration-success">
        <h2>Registration Successful!</h2>
        <p>You will be redirected to login page shortly...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="register-block">
        <div className="container">
          <div className="row">
            <div className="col register-sec">
              <h2 className="text-center">Register Now</h2>
              <form onSubmit={handleSubmit} className="register-form">
                
                <div className="form-group">
                  <label className="text-uppercase">Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="text-danger">Name is required</span>}
                </div>

                <div className="form-group">
                  <label className="text-uppercase">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="text-danger">Email is required</span>}
                </div>

                <div className="form-group">
                  <label className="text-uppercase">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <span className="text-danger">Password is required</span>}
                </div>

                {errors.apiError && (
                  <div className="alert alert-danger">
                    {errors.apiError}
                  </div>
                )}

                <div className="form-group">
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn btn-login float-right"
                      disabled={loading}
                    >
                      Register
                    </button>
                  )}
                </div>

                <div className="clearfix"></div>
                <div className="form-group">
                  Already have an account? <Link to="/login">Login here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}