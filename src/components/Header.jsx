





import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('favorites'); 
    setUser(null);
    navigate('/signin');
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          ProConnect
        </Link>
        
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="search" 
            placeholder="Search by name, skill, or specialty..." 
            className="search-input"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </form>

        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/favorites" className="header-link">My Favorites</Link>
              {/* Turn the welcome message into a link */}
              <Link to="/dashboard" className="header-link welcome-message">
                Welcome, {user.name}
              </Link>
              <button onClick={handleSignOut} className="header-button signout">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin" className="header-button signin">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;