import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './navbar.css';

export default function Navbar({ user }) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setShowDropdown(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Sign out successful');
      })
      .catch((error) => console.log(error));
  };

  return (
    <nav>
      <div className="navv">
          <img src="logoW.png" alt="logoW" />
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/completed">Completed Task</Link>
            <Link to="/trash">Trash</Link>
          </div>
          <div className="user-right">
          <p className='authName'>{user.displayName}</p>
        <span className="dropdown-icon" onClick={toggleDropdown}>
          &#9660;
        </span>
        {showDropdown && (
          <div className="dropdown-content">
            <button onClick={userSignOut}>Logout</button>
          </div>
        )}
      </div>
      </div>
    </nav>
  );
}
