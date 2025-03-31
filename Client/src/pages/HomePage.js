import { Link } from 'react-router-dom';
import { isAuthenticated } from "../services/Auth";

export function HomePage() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Task Manager</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Get Started</h2>
              <div className="d-grid gap-3 mt-4">
                {!isAuthenticated() ? (
                  <>
                    <Link to="/login" className="btn btn-primary btn-lg">
                      Login
                    </Link>
                    <br />
                    <br />
                    <Link to="/register" className="btn btn-secondary btn-lg">
                      Create Account
                    </Link>
                    <br />
      
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="btn btn-success btn-lg">
                      Go to Dashboard
                    </Link>
                    <br></br>
                    <button 
                      className="btn btn-outline-danger btn-lg"
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}