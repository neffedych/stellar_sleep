import React, { useState } from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const goToMaingPage = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo" >
         <img onClick={goToMaingPage} alt='stellar-sleep img' src='/stellar_sleep.jpeg'></img>
      </div>

      <div
        className="user-section"
        onClick={() => setIsDropdownOpen(prev => !prev)}
      >
        <span className="user-name">{userName}</span>
        <div className="dropdown-icon">▼</div>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
