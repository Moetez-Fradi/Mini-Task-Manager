import { Link, Navigate, redirect, useNavigate } from "react-router-dom"
import { isAuthenticated } from "../services/Auth"
import { useState, useEffect } from "react";
import BASE_URL from "../services/baseUrl";
import axios from "axios";

export default function NavBar(props){
          const [logoutStatus, setLogoutStatus] = useState(false);
          const navigate = useNavigate();
    
          useEffect(() => {
            const checkAdminStatus = async () => {
              const isAuth = await isAuthenticated();
              setLogoutStatus(isAuth);
            };
            
            checkAdminStatus();
          }, []);

          const logout = async () => {
            try {
              await axios.get(BASE_URL + '/auth/logout', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('idToken')}`
                }
              });
              
              localStorage.removeItem('idToken');
              
              setLogoutStatus(false);
              navigate('/login');

            } catch (error) {
              console.error('Logout failed:', error);
            }
          }

    return ( <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Task Manager</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto"  >
                        {!isAuthenticated()?<li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>:null}
                        {!isAuthenticated()?<li><Link className="nav-link" to="/login" >Login</Link></li>:null}
                        {isAuthenticated()?<li className="nav-item"><Link className="nav-link" to="/dashboard" >Dashboard</Link></li>:null}
                        {isAuthenticated()?<li><a className="nav-link"  onClick={logout} style={{cursor:"pointer"}} >Logout</a></li>:null}
                    </ul>
                </div>
            </nav>)
}