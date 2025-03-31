import './LoginPage.css';
import { useState } from 'react';
import { storeUserData } from '../services/Storage';
import { isAuthenticated } from '../services/Auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';
import BASE_URL from '../services/baseUrl';

export default function LoginPage() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let validationErrors = { ...initialStateErrors };
        let hasError = false;

        if (!inputs.email) {
            validationErrors.email.required = true;
            hasError = true;
        }
        if (!inputs.password) {
            validationErrors.password.required = true;
            hasError = true;
        }

        setErrors(validationErrors);

        if (hasError) return;

        setLoading(true);
        try {
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
                email: inputs.email,
                password: inputs.password
            });

            const token = loginResponse.data;

            storeUserData(token);
            
            const statusResponse = await axios.get(`${BASE_URL}/auth/status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            navigate('/dashboard');
            
        } catch (err) {
            if (err.response && err.response.status === 401) {  
                setErrors(prev => ({ ...prev, custom_error: "Invalid Credentials." }));
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    custom_error: err.response?.data?.message || "An unexpected error occurred." 
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <section className="login-block">
                <div className="container">
                    <div className="row">
                        <div className="col login-sec">
                            <h2 className="text-center">Login Now</h2>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        onChange={handleInput}
                                        name="email"
                                        placeholder="email"
                                        value={inputs.email}
                                    />
                                    {errors.email.required && (
                                        <span className="text-danger">Email is required.</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        onChange={handleInput}
                                        name="password"
                                        placeholder="password"
                                        value={inputs.password}
                                    />
                                    {errors.password.required && (
                                        <span className="text-danger">Password is required.</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    {loading && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    {errors.custom_error && (
                                        <p className="text-danger">{errors.custom_error}</p>
                                    )}
                                    <input
                                        type="submit"
                                        className="btn btn-login float-right"
                                        disabled={loading}
                                        value={loading ? 'Logging in...' : 'Login'}
                                    />
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group">
                                    Create new account? Please <Link to="/register">Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}