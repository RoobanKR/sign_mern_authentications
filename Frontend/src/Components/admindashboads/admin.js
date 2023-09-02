import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupList from '../Signup/SignupList';
import { useAuth } from '../Jwt/AuthCOntext';
import AdminList from './AddAdmin';

function AdminPage() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      // Read the username from the cookie
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'username') {
          setUsername(value);
          break;
        }
      }

      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="admin-container">
      <div className="background-image"></div>
      <div className="content">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {username && <h1>Welcome, Admin {username}</h1>}
            {!username && <h1>Welcome to the Admin Page</h1>}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <Link to="/AddUser">
              <button>Add User</button>
            </Link>
          </>
        )}
      </div>
      <SignupList />
    <Link to ='/Addadmin'>  <button> AddAdmin</button></Link>
    </div>
  );
}

export default AdminPage;
