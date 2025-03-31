import axios from "axios";

const BASE_URL = 'http://localhost:40000';

export const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
  
  export const isAuthenticated = () => {
    // console.log("Current localStorage content:", localStorage);
    const token = localStorage.getItem('idToken');
    
    if (!token) return false;
  
    return true;
  };
  
  export const isAdminUser = async () => {
    const token = localStorage.getItem('idToken');
    if (!token) return false;
  
    const decoded = parseJwt(token);
    const response = await axios.get(BASE_URL + `/users/${decoded.sub}`)
    console.log(response.data.role === 'ADMIN')
    return response.data.role === 'ADMIN';
  };
  
  export const storeUserData = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };